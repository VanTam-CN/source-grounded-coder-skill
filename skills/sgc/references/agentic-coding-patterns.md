# Agentic Coding Patterns

Use this reference when the main `SKILL.md` is not enough for a complex coding task.

## 1. Source-Grounded Exploration

Start with the narrowest useful search:

- known file path -> read that file;
- known symbol -> search symbol definition and call sites;
- known error -> search exact error text, then stack frames;
- unknown feature -> search routes, tests, command names, component names, and docs.

Stop exploring when you can name the files to change, the local convention to follow, and the verification command to run.

## 2. Minimal Complete Change

A good patch is both small and complete:

- small enough to review;
- aligned with existing abstractions;
- complete enough to solve the user-visible problem;
- verified with executable evidence.

Avoid changing style, architecture, naming, or adjacent behavior unless the task requires it.

## 3. Failure-Driven Debugging

When a test, build, or command fails:

1. Read the first real error and the nearest stack frames.
2. Separate environmental failure from product failure.
3. Reproduce with a narrower command if possible.
4. Change the root cause, not the assertion or wrapper that exposes it.
5. Re-run the failing check before broader checks.

Do not suppress errors, skip hooks, relax tests, or downgrade validation just to produce a passing result.

## 4. Planning Depth

Use a plan when:

- the task touches multiple files or subsystems;
- there are unknowns that require exploration;
- the user provided multiple requirements;
- verification has several phases;
- destructive or shared-state operations are possible.

Skip a formal plan when the task is a one-file, one-step edit or a direct answer.

## 5. Delegation Without Abdication

If the host agent supports subagents or workers:

- delegate independent read-only research in parallel;
- give each worker a self-contained prompt;
- synthesize findings yourself before asking for implementation;
- do not ask one worker to understand another worker's vague report;
- use a fresh verifier when independence matters;
- continue the same worker when it has useful error context.

The coordinator owns the final answer. Worker output is evidence, not a substitute for judgment.

## 6. Code Review Mode

When reviewing code:

- lead with bugs, regressions, security issues, data loss, or missing verification;
- include file and line references;
- order findings by severity;
- avoid broad style commentary unless it blocks correctness;
- say clearly when no actionable issues are found;
- mention residual risk or unrun tests after findings.

## 7. Communication Patterns

Good final reports usually include:

- what changed;
- what command or flow verified it;
- what failed or was not run;
- one practical next step if needed.

Avoid:

- inflated claims;
- hidden failures;
- long process logs;
- unexplained jargon;
- generic "all good" summaries.

