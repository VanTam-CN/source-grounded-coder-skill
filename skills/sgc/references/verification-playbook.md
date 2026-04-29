# Verification Playbook

Verification means executing the changed behavior and comparing observed output against expected behavior. Reading code can guide verification, but it is not verification by itself.

## Universal Baseline

1. Check project instructions for build, test, lint, and run commands.
2. Inspect package or build files for available scripts.
3. Run the narrowest relevant check first.
4. If that passes, run a broader check when the risk justifies it.
5. Record exact failures and do not call the task complete until unresolved failures are explained.

## Change-Type Strategies

### Bug Fix

- Reproduce the failure or identify the failing path.
- Apply the smallest root-cause fix.
- Re-run the failing check.
- Run a nearby regression check.

### Frontend

- Start the dev server or static preview when needed.
- Navigate to the affected screen.
- Interact with the changed control, not just render the page.
- Check console errors, network failures, loading states, empty states, and mobile layout when relevant.

### Backend or API

- Start the service or invoke the handler.
- Send representative valid and invalid requests.
- Check status code, response shape, persistence effects, and error messages.
- Probe idempotency or concurrency if mutation is involved.

### CLI or Script

- Run the command with representative input.
- Check stdout, stderr, and exit code.
- Try empty, malformed, and boundary inputs when relevant.
- Confirm help text or usage examples if the interface changed.

### Library or Package

- Build or typecheck.
- Run tests.
- Import the public API from a consumer-like context.
- Compare exported types and documented examples when relevant.

### Refactor

- Run existing tests unchanged.
- Compare public API surface if exports changed.
- Spot-check representative inputs and outputs.
- Confirm no unrelated behavior was intentionally changed.

### Infrastructure or Config

- Validate syntax.
- Run dry-run commands where possible.
- Confirm referenced environment variables, secrets, and paths actually line up.
- Avoid applying changes to shared systems without explicit authorization.

## Adversarial Probes

Pick probes that fit the change:

- boundary values: empty, zero, negative, large, unicode, null;
- malformed input;
- repeated mutation for idempotency;
- missing or orphan IDs;
- concurrent requests;
- persistence after reload or restart;
- permission denied or unavailable dependency.

At least one adversarial probe is useful for non-trivial implementation work.

## Reporting Template

Use this structure when the task has meaningful verification:

```text
Changed:
- ...

Verified:
- Command or flow: ...
- Observed result: ...

Not verified:
- ...
```

If verification fails, lead with the failing command and the relevant output. Then describe the next action.

