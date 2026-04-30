#!/usr/bin/env node

import { cp, mkdir, rm, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const skillName = 'sgc'
const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const sourceDir = path.join(repoRoot, 'skills', skillName)

const platformTargets = {
  'claude-code': '~/.claude/skills',
  codex: '~/.codex/skills',
  opencode: '~/.config/opencode/skills',
  agents: '~/.agents/skills',
}

function usage() {
  console.log(`Usage: node scripts/install.mjs [options]

Install ${skillName} into a host skills directory.

Options:
  --platform <name>   One of: ${Object.keys(platformTargets).join(', ')}
  --target <path>     Explicit skills directory to install into
  --force             Replace an existing installed skill directory
  -h, --help          Show this help

Examples:
  node scripts/install.mjs --platform codex
  node scripts/install.mjs --platform claude-code --force
  node scripts/install.mjs --target .agents/skills`)
}

function parseArgs(argv) {
  const parsed = { force: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      parsed.help = true
    } else if (arg === '--force') {
      parsed.force = true
    } else if (arg === '--platform') {
      parsed.platform = argv[++i]
    } else if (arg === '--target') {
      parsed.target = argv[++i]
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }
  return parsed
}

function expandHome(value) {
  if (value === '~') return os.homedir()
  if (value.startsWith('~/')) return path.join(os.homedir(), value.slice(2))
  return value
}

async function chooseTarget() {
  const entries = Object.entries(platformTargets)
  const rl = readline.createInterface({ input, output })
  try {
    console.log('Choose an install target:')
    entries.forEach(([name, target], index) => {
      console.log(`  ${index + 1}. ${name} (${target})`)
    })
    console.log(`  ${entries.length + 1}. custom path`)

    const answer = await rl.question('Target number: ')
    const choice = Number(answer.trim())
    if (choice >= 1 && choice <= entries.length) {
      return entries[choice - 1][1]
    }
    if (choice === entries.length + 1) {
      return rl.question('Custom skills directory: ')
    }
    throw new Error('Invalid target choice')
  } finally {
    rl.close()
  }
}

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  if (args.platform && args.target) {
    throw new Error('Use either --platform or --target, not both')
  }

  const targetRoot =
    args.target ??
    (args.platform ? platformTargets[args.platform] : await chooseTarget())

  if (!targetRoot) {
    throw new Error(`Unknown platform: ${args.platform}`)
  }

  const installRoot = path.resolve(expandHome(targetRoot))
  const destination = path.join(installRoot, skillName)

  if ((await exists(destination)) && !args.force) {
    throw new Error(
      `Destination already exists: ${destination}\nRe-run with --force to replace it.`,
    )
  }

  if ((await exists(destination)) && args.force) {
    await rm(destination, { recursive: true, force: true })
  }

  await mkdir(installRoot, { recursive: true })
  await cp(sourceDir, destination, {
    recursive: true,
    force: args.force,
    errorOnExist: !args.force,
  })

  console.log(`Installed sgc (Source Grounded Coder) to ${destination}`)
}

main().catch(error => {
  console.error(`Install failed: ${error.message}`)
  process.exit(1)
})

