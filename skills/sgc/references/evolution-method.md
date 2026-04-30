# Evolution Method

How this skill captures real-world failures and distills them into rule updates. Inspired by [self-improving-agent](https://github.com/pskoett/self-improving-agent) and [Darwin Skill](https://github.com/alchaincyf/darwin-skill). Lightweight: markdown files, git for rollback, human confirmation for edits. No external dependencies.

## Capture Location

Captures go to the **project-local** `.sgc/` directory, not the installed skill package. This prevents:
- Polluting globally installed skill packages with task-specific data
- Writing business-sensitive information into a distributable artifact
- Permission failures on read-only global install directories

Capture precedence:
1. Project-local `.sgc/evolution-log.md` (default, always available)
2. Final report snippet in task output (if `.sgc/` is not writable)
3. Skill source repository (only in explicit evolution mode, with user authorization)

## When to Capture

Capture a failure entry during any task when:

1. A Decision Rule did not cover the situation, or pointed the agent in the wrong direction.
2. A Mental Model led to a wrong approach (e.g., "Terminal is truth" but the terminal output was stale).
3. The user rejected output for reasons Expression DNA should have covered.
4. A verification strategy missed a real bug, or suggested irrelevant checks.
5. An Honest Boundary was wrong — the skill claimed inability for something it could do, or vice versa.

Do NOT capture:

- Failures caused by the code itself (bugs, missing features, bad architecture).
- Failures caused by the environment (missing dependencies, network issues, sandbox limits).
- One-off user preferences that do not generalize.
- Failures where the skill's guidance was correct but the agent ignored it.
- Secrets, tokens, private keys, or full source/config files.

## Entry Format

Append to `.sgc/evolution-log.md` under Active Entries:

```markdown
### [EVO-YYYYMMDD-XXX] section: [SKILL.md section] | priority: low|medium|high

**Logged**: ISO-8601 timestamp
**Status**: pending
**Gap**: [one sentence describing what was missing or wrong]
**Evidence**: [abbreviated command output, user feedback, or error message]
**Candidate rule**: [IF-THEN format, one line]
**Recurrence-Count**: 1
**First-Seen**: YYYY-MM-DD
**Last-Seen**: YYYY-MM-DD
```

ID format: `EVO-YYYYMMDD-XXX` where XXX is a sequential number or random 3 chars.

## Distillation Pipeline

### Phase 1: Accumulate

Entries collect during normal work in `.sgc/evolution-log.md`. No action until the user requests evolution.

### Phase 2: Cluster

When the user requests evolution:

1. Read all Active Entries from `.sgc/evolution-log.md`.
2. Search for existing entries with similar gaps before creating new ones.
3. If a similar entry exists, increment `Recurrence-Count` and update `Last-Seen`.
4. Entries with `Recurrence-Count >= 2` become high-priority candidates.

### Phase 3: Filter

Run each candidate through the Triple Verification filter (see `extraction-method.md`), adapted by rule type:

| Rule type | Verification criterion |
|---|---|
| Decision Rule (IF-THEN) | Must produce a specific next action |
| Mental Model | Must change priority or tradeoff calculus |
| Expression DNA | Must produce an observable output constraint |
| Honest Boundary | Must define a stop/escalate condition |

Additional universal checks:
- **Cross-domain**: Does this apply to a React frontend and a Rust backend equally?
- **Exclusive**: If inverted, is it still a coherent engineering philosophy?

| Checks passed | Outcome |
|---|---|
| All criteria met | Candidate for SKILL.md |
| Most criteria met | Heuristic for a reference file |
| Few or none met | Discard |

### Phase 4: Place

Map accepted rules to SKILL.md sections:

| Rule type | Target section |
|---|---|
| IF-THEN trigger | Decision Rules |
| High-level decision lens | Mental Models |
| Communication pattern | Expression DNA |
| Capability limit | Honest Boundaries |
| Detailed example or edge case | Appropriate reference file |

### Phase 5: Promote

After a rule is placed in SKILL.md:

1. Update the original entry: `**Status**: promoted`
2. Add `**Promoted**: Decision Rules | Mental Models | Expression DNA | Honest Boundaries`
3. If the learning is broadly applicable beyond the skill, suggest promoting to the project's `CLAUDE.md` or equivalent.

## Size Management

SKILL.md must stay near 150 lines. When an addition would exceed 155 lines:

1. Compress the longest bullet in the target section; move the detail to a reference file.
2. If still over limit, place the new rule in the appropriate reference file with a one-line summary and link in SKILL.md.

Hard cap: 225 lines (150% of target). Above this, the pipeline MUST move content to references/ before accepting any new rule.

## Safety Constraints

- **Human confirmation**: Never edit SKILL.md without user approval. Present the proposed change, the Triple Verification results, and the target section.
- **Project-local capture**: Write captures to `.sgc/` in the project directory, never to the globally installed skill package.
- **Git checkpoint**: Before any SKILL.md edit, ensure the working directory is clean or create a new branch (e.g., `git checkout -b sgc-evolution`). This prevents mixing rule updates with application code.
- **One rule per cycle**: Do not batch multiple rule changes. Each rule update is a separate proposal, evaluation, and confirmation.
- **No silent edits**: The evolution mechanism modifies SKILL.md only through explicit, user-approved edits.

## Log Maintenance

- After a candidate is accepted or rejected, update its entry status in `.sgc/evolution-log.md`.
- When entries exceed 50 total, archive the oldest resolved/rejected entries to prevent unbounded growth.
- Active entries with no activity for 30 days should be evaluated or discarded.
- Run `.sgc/evolution-log.md` review before starting a major task to check for relevant past learnings.
