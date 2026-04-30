# Extraction Method

This skill distills reusable engineering behavior from observable host behavior, public documentation, and operational patterns without copying proprietary prompt text or source code.

## Why Extract From Claude Code

Claude Code encodes hard-won operational knowledge in its system prompt, tool behaviors, and skill ecosystem:

- how the agent should read, search, edit, and run commands
- when planning helps and when it adds overhead
- how to avoid destructive operations
- how to delegate work without losing accountability
- how to treat tests, builds, and runtime output as evidence
- how to report failure honestly instead of manufacturing a green result

The goal is not to imitate Claude Code's product identity. The goal is to reverse-engineer its robust engineering patterns and convert them into a portable skill that any compatible agent can use.

## Distillation Filter (Triple Verification)

A candidate rule belongs in the skill only if it passes all applicable checks. Verification criteria vary by rule type:

**Universal checks** (all rule types):
- **Cross-domain (跨域复现)**: Does this rule apply to a React frontend and a Rust backend equally? Rules that only work for one language or framework are too narrow.
- **Exclusive (排他性)**: If inverted, is it still a valid (though different) engineering philosophy? "Search before read" vs "read everything" are both coherent strategies. We encode one approach because the evidence shows it is more effective.

**Type-specific checks**:
- **Decision Rule**: Must strictly dictate the *next action* the agent takes. "Use grep first" generates a tool call. "Be careful" does not.
- **Mental Model**: Must change a priority or tradeoff calculus. "Terminal is truth" shifts shell output above assumptions.
- **Expression DNA**: Must produce an observable output constraint. "One-sentence updates" constrains response length.
- **Honest Boundary**: Must define a stop or escalation condition. "Cannot access files outside sandbox" defines when to ask the user.

**If a rule passes only 1-2 checks**, downgrade it to a heuristic or discard it. **0 checks** means it is generic advice that adds no value.

## Source Categories To Study

Use these categories when refreshing the skill:

1. **Observable host behavior**: identity, task execution rules, communication style, safety boundaries. (Primary source: observable agent behavior in real sessions)
2. **Tool contracts**: file reading, exact editing, search, shell execution, permissions, and failure modes. (Primary source: tool descriptions and permission model)
3. **Planning and task tracking**: when to create a plan, how to update it, and when to skip it. (Primary source: Plan mode and TodoWrite behavior)
4. **Agent orchestration**: when to use a subagent, when to keep work local, how to synthesize findings. (Primary source: Agent tool and team coordination)
5. **Verification specialists**: how to test behavior directly, how to probe edge cases, and how to format evidence. (Primary source: verification skill patterns)
6. **Error handling**: how failures are classified, surfaced, retried, or escalated. (Primary source: debugging patterns and systematic-debugging)
7. **Expression DNA**: communication fingerprint, taboos, reporting format, tone. (Primary source: observable output patterns)

## Extraction Pipeline

### Phase 1: Data Collection

- Capture Claude Code's system prompt rules (communication, tool usage, safety)
- Observe actual tool call patterns in real sessions (parallel reads, targeted grep, sequential edits)
- Collect skill definitions that encode specialized workflows (TDD, debugging, code review)
- Note failure modes: when does Claude Code get stuck, produce bad output, or break user trust?

### Phase 2: Distillation

- Filter each candidate rule through the Triple Verification above
- Separate into tiers:
  - **Mental Models**: high-level lenses that affect all decisions (e.g., "Terminal is truth")
  - **Decision Rules**: specific IF-THEN triggers that dictate the next action
  - **Expression DNA**: communication fingerprint, taboos, reporting format
  - **Honest Boundaries**: explicit limitations and when to escalate to the user

### Phase 3: Build

- Map distilled rules into `SKILL.md` sections
- Keep `SKILL.md` under 150 lines — push detail into `references/`
- Ensure every rule is actionable (an agent can execute it, not just agree with it)

### Phase 4: Validation

- Run `npm run validate` to check structural requirements
- Test the skill against an isolated repository with a known bug
- Verify the skill does not contradict itself or produce unsafe suggestions
- Check that the Expression DNA section actually changes agent output style

## Contradiction Handling

Claude Code has genuine tensions in its design philosophy:

- **Completeness vs. brevity**: "finish the user-visible behavior" but "one-sentence updates"
- **Autonomy vs. caution**: "proceed directly for simple tasks" but "ask before destructive actions"
- **Trust agents but verify**: delegate to subagents but always check their actual output

These are not bugs to fix. They are design tradeoffs. Preserve them as explicit tensions in the Mental Models and let context resolve them.

## Updating The Skill

When the skill performs poorly in real work:

1. Capture the user task, failure mode, command output, and resulting bug.
2. Identify the missing decision rule or weak rule.
3. Run the candidate through the Triple Verification filter.
4. Add or revise one concise rule in `SKILL.md` if it passes all three checks.
5. Put longer examples or edge cases in a reference file.
6. Re-test the skill with a different task so it does not overfit the original failure.
