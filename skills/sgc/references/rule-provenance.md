# Rule Provenance

Audit trail for every rule in SKILL.md. Each entry records the rule's source, verification scores, and placement rationale. This makes the Triple Verification filter auditable rather than aspirational.

## Decision Rules

| Rule | Scope | Evidence Source | Cross-domain | Generative | Exclusive | Placed |
|------|-------|-----------------|-------------|------------|-----------|--------|
| [Exploration] | File discovery | Claude Code tool contracts: grep/glob before read | Yes | Yes (dictates search) | Yes (vs read-all) | v0.1 |
| [Planning] | Multi-file safety | Claude Code Plan Mode behavior | Yes | Yes (dictates plan output) | Yes (vs skip-plan) | v0.1 |
| [Editing] | Pre-edit inspection | Claude Code edit patterns | Yes | Yes (dictates read-first) | Yes (vs edit-first) | v0.1 |
| [Bug fix] | Debugging workflow | nuwa-skill verification methodology | Yes | Yes (dictates reproduce) | Yes (vs guess-fix) | v0.1 |
| [Tests] | Test integrity | Claude Code "never hide failures" behavior | Yes | Yes (dictates diagnose) | Yes (vs bypass) | v0.1 |
| [No tests] | Evidence fallback | Claude Code verification specialists | Yes | Yes (dictates closest check) | Partial (no clean inverse) | v0.1 |
| [Safety] | Destructive actions | Claude Code permission model | Yes | Yes (dictates ask) | Yes (vs auto-destruct) | v0.1 |
| [Convention] | Repository norms | nuwa-skill extraction methodology | Yes | Partial (follow, don't dictate) | Yes (vs ignore) | v0.1 |
| [Review] | Code review format | Claude Code review output patterns | Yes | Yes (dictates severity order) | Partial (no clean inverse) | v0.1 |
| [Blocked] | Dependency reporting | Claude Code error handling | Yes | Yes (dictates report) | Yes (vs proceed-blindly) | v0.1 |
| [Capture] | Evolution input | self-improving-agent capture patterns | Yes | Yes (dictates log write) | Yes (vs ignore-gaps) | v0.3 |
| [Evolution] | Evolution output | darwin-skill distillation loop | Yes | Yes (dictates cluster+propose) | Yes (vs auto-edit) | v0.3 |

## Mental Models

| Rule | Scope | Evidence Source | Cross-domain | Priority-shift | Exclusive | Placed |
|------|-------|-----------------|-------------|--------------|-----------|--------|
| Terminal is truth | Evidence hierarchy | Claude Code system prompt | Yes | Yes (shell > assumption) | Yes (vs trust-code) | v0.1 |
| Search before read, read before write | File access | Claude Code tool contracts | Yes | Yes (narrows scope) | Yes (vs read-all) | v0.1 |
| Context is reality | Local over general | nuwa-skill extraction methodology | Yes | Yes (local > global) | Yes (vs general-first) | v0.1 |
| Small diff, complete behavior | Scope control | Claude Code edit patterns | Yes | Yes (minimize surface) | Yes (vs scaffold-first) | v0.1 |
| Three lines beat an abstraction | Anti-premature-abstract | Claude Code coding patterns | Yes | Yes (favor simple) | Yes (vs DRY-all) | v0.1 |
| Failure is data | Error recovery | nuwa-skill debugging methodology | Yes | Yes (preserve > discard) | Yes (vs retry-blindly) | v0.1 |
| Verification is adversarial | Test thoroughness | Claude Code verification specialists | Yes | Yes (probe edges) | Yes (vs happy-path) | v0.1 |
| Blast radius first | Safety scope | Claude Code permission model | Yes | Yes (scope risk) | Yes (vs blast-first) | v0.1 |
| Trust but verify | Agent delegation | Claude Code subagent patterns | Yes | Yes (check output) | Yes (vs trust-blindly) | v0.1 |

## Expression DNA

| Rule | Scope | Evidence Source | Cross-domain | Observable constraint | Exclusive | Placed |
|------|-------|-----------------|-------------|---------------------|-----------|--------|
| Brevity is default | Communication | Claude Code tone guidelines | Yes | Yes (short output) | Yes (vs verbose) | v0.2 |
| Results over narration | Communication | Claude Code output patterns | Yes | Yes (state results) | Yes (vs narrate) | v0.2 |
| Evidence-first references | Communication | Claude Code reference format | Yes | Yes (file:line) | Yes (vs vague "in file") | v0.2 |
| Tool calls without fanfare | Communication | Claude Code tool patterns | Yes | Yes (no prefix) | Yes (vs announce) | v0.2 |
| No meta-commentary | Communication | Claude Code taboo phrases | Yes | Yes (no filler) | Yes (vs explain-process) | v0.2 |
| End-of-turn | Communication | Claude Code turn structure | Yes | Yes (2 sentences) | Partial (style) | v0.2 |
| Taboo phrases | Communication | Claude Code forbidden phrases | Yes | Yes (avoid phrases) | Yes (vs allow) | v0.2 |

## Honest Boundaries

| Rule | Scope | Evidence Source | Cross-domain | Stop/escalate | Exclusive | Placed |
|------|-------|-----------------|-------------|---------------|-----------|--------|
| No interactive CLI | Capability limit | Claude Code tool contracts | Yes | Yes (escalate) | Yes (vs attempt) | v0.2 |
| No visual UI aesthetics | Capability limit | Claude Code browser patterns | Yes | Yes (DOM-only) | Yes (vs claim-beauty) | v0.2 |
| No architecture guessing | Capability limit | nuwa-skill design philosophy | Yes | Yes (ask user) | Yes (vs assume) | v0.2 |
| Sandbox limits | Capability limit | Claude Code permission model | Yes | Yes (ask approval) | Yes (vs bypass) | v0.2 |
| Context window finite | Capability limit | Claude Code context behavior | Yes | Yes (incremental) | Yes (vs assume-full) | v0.2 |
| External API drift | Capability limit | Claude Code doc query behavior | Yes | Yes (verify docs) | Yes (vs assume-stable) | v0.2 |

## Updating This Table

When a new rule is added or an existing rule is modified through the evolution pipeline:

1. Add or update the row with the full verification scores.
2. Note the version when the rule was placed.
3. If a rule is removed, mark it as `Removed in vX.Y` with the reason.
