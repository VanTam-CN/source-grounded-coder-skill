#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node scripts/validate-skill.mjs [repo-root]

Validates Agent Skills under <repo-root>/skills.

Checks:
  - skill directory naming
  - required SKILL.md
  - YAML frontmatter with name and description
  - frontmatter name matches directory
  - SKILL.md line count
  - relative SKILL.md links to references/*.md exist
  - required SKILL.md sections (Role, Mental Models, Decision Rules, etc.)

YAML support is intentionally limited to the Agent Skills metadata subset:
scalar top-level fields, nested maps, and simple lists. This is not a
general-purpose YAML parser.`)
  process.exit(0)
}

const root = args[0] ?? process.cwd()
const skillsDir = path.join(root, 'skills')
const namePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

function fail(message) {
  console.error(`FAIL ${message}`)
  process.exitCode = 1
}

function parseFrontmatter(content, filePath) {
  if (!content.startsWith('---\n')) {
    fail(`${filePath}: missing YAML frontmatter`)
    return null
  }

  const end = content.indexOf('\n---', 4)
  if (end === -1) {
    fail(`${filePath}: unterminated YAML frontmatter`)
    return null
  }

  const raw = content.slice(4, end).trim()
  const metadata = {}

  const lines = raw.split('\n')
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim() || line.trimStart().startsWith('#')) {
      index++
      continue
    }

    const field = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!field) {
      fail(`${filePath}: unsupported frontmatter line: ${line}`)
      index++
      continue
    }

    const [, key, value] = field
    if (value === undefined || value === '') {
      const parsed = parseIndentedBlock(lines, index + 1, 2, filePath)
      metadata[key] = parsed.value
      index = parsed.nextIndex
    } else {
      metadata[key] = stripQuotes(value)
      index++
    }
  }

  return metadata
}

function parseIndentedBlock(lines, startIndex, indent, filePath) {
  const block = {}
  const list = []
  let mode = null
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim() || line.trimStart().startsWith('#')) {
      index++
      continue
    }

    const actualIndent = line.match(/^ */)[0].length
    if (actualIndent < indent) break
    if (actualIndent > indent) {
      fail(`${filePath}: unsupported indentation: ${line}`)
      index++
      continue
    }

    const trimmed = line.slice(indent)
    if (trimmed.startsWith('- ')) {
      if (mode === 'map') {
        fail(`${filePath}: cannot mix list and map entries in one block`)
      }
      mode = 'list'
      list.push(stripQuotes(trimmed.slice(2)))
      index++
      continue
    }

    const field = trimmed.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!field) {
      fail(`${filePath}: unsupported frontmatter line: ${line}`)
      index++
      continue
    }

    if (mode === 'list') {
      fail(`${filePath}: cannot mix list and map entries in one block`)
    }
    mode = 'map'

    const [, key, value] = field
    if (value === undefined || value === '') {
      const parsed = parseIndentedBlock(lines, index + 1, indent + 2, filePath)
      block[key] = parsed.value
      index = parsed.nextIndex
    } else {
      block[key] = stripQuotes(value)
      index++
    }
  }

  return {
    value: mode === 'list' ? list : block,
    nextIndex: index,
  }
}

function stripQuotes(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

async function validateReferenceLinks(skillDir, skillName, content) {
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g
  const rootWithSep = `${path.resolve(skillDir)}${path.sep}`
  let match

  while ((match = linkPattern.exec(content)) !== null) {
    const rawTarget = match[1].trim()
    if (
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('mailto:')
    ) {
      continue
    }

    const target = rawTarget.split('#')[0]
    if (!target.startsWith('references/') || !target.endsWith('.md')) {
      continue
    }

    const resolved = path.resolve(skillDir, target)
    if (resolved !== path.resolve(skillDir) && !resolved.startsWith(rootWithSep)) {
      fail(`${skillName}: reference link escapes skill directory: ${rawTarget}`)
      continue
    }

    try {
      const info = await stat(resolved)
      if (!info.isFile()) {
        fail(`${skillName}: reference link is not a file: ${rawTarget}`)
      }
    } catch {
      fail(`${skillName}: missing referenced file: ${rawTarget}`)
    }
  }
}

async function validateSkill(skillName) {
  const skillDir = path.join(skillsDir, skillName)
  const info = await stat(skillDir)
  if (!info.isDirectory()) return

  if (!namePattern.test(skillName) || skillName.length > 64) {
    fail(`${skillName}: invalid skill directory name`)
  }

  const skillPath = path.join(skillDir, 'SKILL.md')
  let content
  try {
    content = await readFile(skillPath, 'utf8')
  } catch {
    fail(`${skillName}: missing SKILL.md`)
    return
  }

  const frontmatter = parseFrontmatter(content, skillPath)
  if (!frontmatter) return

  if (frontmatter.name !== skillName) {
    fail(`${skillName}: frontmatter name must match directory name`)
  }
  if (!frontmatter.description) {
    fail(`${skillName}: description is required`)
  } else if (frontmatter.description.length > 1024) {
    fail(`${skillName}: description exceeds 1024 characters`)
  }
  if (frontmatter.compatibility && frontmatter.compatibility.length > 500) {
    fail(`${skillName}: compatibility exceeds 500 characters`)
  }

  const lineCount = content.split('\n').length
  if (lineCount > 500) {
    fail(`${skillName}: SKILL.md should stay under 500 lines`)
  }
  if (lineCount > 155) {
    console.warn(`WARN ${skillName}: SKILL.md exceeds 155 lines (current: ${lineCount})`)
  }

  await validateReferenceLinks(skillDir, skillName, content)

  // Check required reference files exist
  const refsDir = path.join(skillDir, 'references')
  try {
    const refFiles = await readdir(refsDir)
    const refLinks = []
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    while ((match = linkPattern.exec(content)) !== null) {
      const target = match[2].trim()
      if (target.startsWith('references/') && target.endsWith('.md')) {
        refLinks.push(target.replace('references/', ''))
      }
    }
    for (const link of refLinks) {
      if (!refFiles.includes(link)) {
        fail(`${skillName}: referenced file missing: ${link}`)
      }
    }
  } catch {
    // No references directory is acceptable
  }

  const requiredSections = [
    '## Role',
    '## Mental Models',
    '## Decision Rules',
    '## Implementation Discipline',
  ]
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      fail(`${skillName}: missing required section: ${section}`)
    }
  }

  console.log(`OK   ${skillName}`)
}

async function main() {
  let entries
  try {
    entries = await readdir(skillsDir)
  } catch {
    fail(`missing skills directory: ${skillsDir}`)
    return
  }

  for (const entry of entries) {
    await validateSkill(entry)
  }

  if (process.exitCode) {
    console.error('Skill validation failed.')
  } else {
    console.log('All skills passed validation.')
  }
}

await main()
