# Source Grounded Coder (sgc)

A portable, zero-dependency Agent Skill that makes any coding agent work like a disciplined senior engineer. Grounded in source-code observation, minimal edits, executable verification, and honest reporting.

> "Terminal is truth. Source code is theoretical; shell command output is reality."

## Why

Most coding agents share the same failure modes: hallucinated file paths, oversized diffs, skipped verification, and padded success reports. These are not model capability problems — they are missing behavioral guardrails.

`sgc` distills robust engineering patterns from Claude Code's operational behavior into a portable skill package that works across hosts:

- **Expression DNA**: terse, evidence-first communication with explicit taboo phrases
- **Mental Models**: 9 high-level decision lenses (Terminal is truth, Search before read, Trust but verify, ...)
- **Decision Rules**: IF-THEN triggers for exploration, planning, editing, debugging, and safety
- **Verification Playbook**: change-type-specific strategies with adversarial probes
- **Honest Boundaries**: explicit capability limits — no fake green results

## Quick Start

```sh
node scripts/install.mjs --platform claude-code --force
node scripts/validate-skill.mjs
```

Then tell your agent:

```
Use $sgc to fix this bug. Read the code first, make the smallest safe change, and verify it.
```

## Installation

### Interactive Installer (recommended)

```sh
node scripts/install.mjs                    # Choose interactively
node scripts/install.mjs --platform codex   # Non-interactive
node scripts/install.mjs --target ./skills  # Custom path
node scripts/install.mjs --platform claude-code --force  # Replace existing
```

### Manual Install

```sh
rm -rf ~/.claude/skills/sgc  # Clean old version first
cp -R skills/sgc ~/.claude/skills/sgc
```

For other hosts, replace the target path: `~/.codex/skills/`, `~/.config/opencode/skills/`, `~/.agents/skills/`.

## Compatibility

| Host | Status | Required Capabilities |
|------|--------|-----------------------|
| Claude Code | Supported | File read/search/edit, shell, MCP docs (optional), browser (optional) |
| Codex | Supported | File read/search/edit, shell, `agents/openai.yaml` UI metadata |
| OpenCode | Supported | File read/search/edit, shell, SKILL.md discovery |
| OpenClaw | Supported | File read/search/edit, shell, `.agents/skills/` discovery |
| Other hosts | Supported | File read/search/edit, shell |

The skill runtime has no dependencies. The installer and validator require **Node >= 18** (`fs.cp` needs Node 18+).

## How It Works

The skill activates when the task involves coding, debugging, refactoring, code review, tests, or pull-request preparation. It enforces a six-step operating loop:

```
Frame → Inspect → Plan → Edit → Validate → Report
```

Each step has explicit decision rules. For example:

- **Inspect before changing**: `grep`/`glob` for exact paths, read targeted ranges, never guess
- **Edit narrowly**: smallest coherent change, prefer existing patterns over new abstractions
- **Validate by execution**: run tests, builds, or typechecks — reading code is not verification
- **Report faithfully**: state what changed, what was verified, what could not be verified

## Skill Structure

```
skills/sgc/
├── SKILL.md                              # Activation contract + operating loop (~150 lines)
├── agents/openai.yaml                    # Codex/OpenAI UI metadata
└── references/
    ├── agentic-coding-patterns.md        # 7 expanded coding-agent heuristics
    ├── extraction-method.md              # Triple Verification distillation methodology
    ├── evolution-method.md               # Self-evolution distillation pipeline
    ├── evolution-log.md                  # Captured failures and candidate rule updates (template)
    ├── rule-provenance.md                # Audit trail for every rule (verified scores)
    └── verification-playbook.md          # Evidence patterns by change type
```

**Design principle**: `SKILL.md` stays compact. Longer material lives in `references/` so agents load it only when needed.

## Extraction Methodology

This skill uses a Triple Verification filter to ensure every rule is robust:

1. **Cross-domain**: applies equally to a React frontend and a Rust backend
2. **Generative**: strictly dictates the agent's next action (not just "be careful")
3. **Exclusive**: if inverted, it is still a coherent (though different) philosophy

A rule must pass all three checks to enter `SKILL.md`. See [references/extraction-method.md](skills/sgc/references/extraction-method.md) for the full pipeline.

## Self-Evolution

The skill can improve itself from real usage. Inspired by the [Darwin Skill](https://github.com/alchaincyf/darwin-skill) concept, it uses a lightweight evolution loop:

```
Capture failures during work → Cluster similar gaps → Filter through Triple Verification → Place validated rules
```

When the skill's guidance is insufficient during a task, the agent captures the gap in `references/evolution-log.md`. When enough evidence accumulates, the distillation pipeline proposes a rule update through the existing Triple Verification filter. All SKILL.md edits require human confirmation and use git checkpoints for rollback.

See [references/evolution-method.md](skills/sgc/references/evolution-method.md) for the full methodology. You can manually trigger this by telling the agent: *"Review evolution-log.md and propose updates."*

## Verification

```sh
# Validate skill structure and metadata
node scripts/validate-skill.mjs

# Checks: directory name, SKILL.md frontmatter, required fields,
#         reference link integrity, section presence
```

## Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/install.mjs` | Interactive/non-interactive installer |
| `node scripts/validate-skill.mjs` | Structural and metadata validator |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Run `node scripts/validate-skill.mjs` to verify structural integrity
4. Test the skill against a real repository task
5. Open a pull request

## License

[MIT](LICENSE)
