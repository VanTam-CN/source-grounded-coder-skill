# Changelog

## 0.4.0 - 2026-04-30

- **P1 fix**: Evolution captures now write to project-local `.sgc/evolution-log.md` instead of the globally installed skill package, preventing pollution and permission failures. (self-improving-agent pattern)
- **P2 fix**: Triple Verification split into type-specific criteria: Decision Rules produce actions, Mental Models shift priorities, Expression DNA constrains output, Honest Boundaries define escalation. (Codex review)
- **P2 fix**: Added `references/rule-provenance.md` with full audit trail for every rule — source, verification scores, placement rationale.
- **P2 fix**: README compatibility table changed from `Full` to `Supported with required capabilities`. Added Node >= 18 requirement.
- **P2 fix**: `install --force` now removes old destination before copying, preventing stale file residue.
- **P2 fix**: Validator now checks referenced files exist and warns when SKILL.md exceeds 155 lines.
- **P2 fix**: `extraction-method.md` provenance risk resolved — references "observable host behavior" instead of proprietary prompts.
- Evolution entry format upgraded: ID system (`EVO-YYYYMMDD-XXX`), priority, recurrence tracking, promotion workflow. (self-improving-agent pattern)
- Quick Start prioritizes interactive installer over manual `cp -R`.

## 0.3.0 - 2026-04-29

- Added self-evolution mechanism: failure capture, distillation pipeline, and rule update protocol.
- New `references/evolution-method.md` with 4-phase distillation pipeline (accumulate, cluster, filter, place).
- New `references/evolution-log.md` for structured failure capture during real work.
- New `[Evolution]` Decision Rule in SKILL.md triggers rule update proposals.
- Evolution pipeline reuses existing Triple Verification filter.
- Safety constraints: human confirmation, git checkpoint, one rule per cycle, size guard.

## 0.2.0 - 2026-04-29

- Fixed installer path handling for repositories checked out under paths containing spaces.
- Aligned package and skill metadata versions.
- Replaced placeholder repository metadata with the public repository URL.
- Expanded the skill with expression, boundary, and validation guidance.

## 0.1.0 - 2026-04-29

- Initial public skill package with portable `SKILL.md`.
- Added OpenAI/Codex UI metadata.
- Added source-grounded coding, verification, and extraction references.
- Added local validation and installation scripts.
