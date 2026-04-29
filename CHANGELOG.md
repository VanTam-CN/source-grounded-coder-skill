# Changelog

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
