# Evolution Method

How this skill captures real-world failures and distills them into rule updates. The mechanism is lightweight: markdown files, git for rollback, human confirmation for edits. No external dependencies.

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

## Entry Format

Append to `evolution-log.md` under Active Entries:

```markdown
### [ISO-8601 timestamp] trigger: [Operating Loop step] | section: [SKILL.md section]

**Gap**: [one sentence describing what was missing or wrong]
**Evidence**: [abbreviated command output, user feedback, or error message]
**Candidate rule**: [IF-THEN format, one line]
```

## Distillation Pipeline

### Phase 1: Accumulate

Entries collect during normal work. No action needed until a user requests evolution.

### Phase 2: Cluster

When the user requests evolution (natural language trigger, or after task completion if the log has entries):

1. Read all Active Entries from `evolution-log.md`.
2. Group entries that describe the same gap.
3. Entries with 2+ occurrences become high-priority candidates. Single-occurrence entries are lower priority but still evaluated.

### Phase 3: Filter

Run each candidate through the Triple Verification filter (see `extraction-method.md`):

- **Cross-domain**: Does this apply to a React frontend and a Rust backend equally?
- **Generative**: Does it strictly dictate the agent's next action?
- **Exclusive**: If inverted, is it still a coherent (though different) engineering philosophy?

| Checks passed | Outcome |
|---|---|
| 3/3 | Candidate for SKILL.md |
| 2/3 | Heuristic for a reference file |
| 0-1/3 | Discard |

### Phase 4: Place

Map accepted rules to SKILL.md sections:

| Rule type | Target section |
|---|---|
| IF-THEN trigger | Decision Rules |
| High-level decision lens | Mental Models |
| Communication pattern | Expression DNA |
| Capability limit | Honest Boundaries |
| Detailed example or edge case | Appropriate reference file |

## Size Management

SKILL.md must stay near 150 lines. When an addition would exceed 155 lines:

1. Compress the longest bullet in the target section; move the detail to a reference file.
2. If still over limit, place the new rule in the appropriate reference file with a one-line summary and link in SKILL.md.

Hard cap: 225 lines (150% of target). Above this, the pipeline MUST move content to references/ before accepting any new rule.

## Safety Constraints

- **Human confirmation**: Never edit SKILL.md without user approval. Present the proposed change, the Triple Verification results, and the target section.
- **Git checkpoint**: Before any SKILL.md edit, commit current state. The user can revert with `git revert HEAD`.
- **One rule per cycle**: Do not batch multiple rule changes. Each rule update is a separate proposal, evaluation, and confirmation.
- **No silent edits**: The evolution mechanism modifies SKILL.md only through explicit, user-approved edits.

## Log Maintenance

- After a candidate is accepted or rejected, move its entry from Active Entries to Processed Entries with the outcome noted.
- When Processed Entries exceed 50 entries, remove the oldest to prevent unbounded growth.
- Active Entries with no activity for 30 days should be evaluated or discarded.
