---
name: get-diagnostics
description: Use eslint to get a list of workspace diagnostics
compatibility: opencode
---

# What I do

- run `eslint .` using the package manager of choice (e.g. `npm run`, `bun run`, `pnpm exec`, `yarn`) to get a list of diagnostics
- export to a DIAGNOSTICS.md in project root containing a list of diagnostics.
- diagnostics are grouped per severity
- diagnostics are concise and with an easy format to track where the problem occurs

# When to use me

Use this when the user asks for an overall view on a project's diagnostics.
