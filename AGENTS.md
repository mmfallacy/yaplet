# Project-Specific Agent Instructions

## Development Environment

- **Runtime**: Bun (`bun dev`, `bun build`, `bun preview`)
- **Nix DevShell**: Available in `./nix/devShell.nix` with Bun, Node.js 24, and language servers (svelte-language-server, vtsls, etc.)
- DO NOT MODIFY THE DEVSHELL. ASK THE USER TO MODIFY IT IN BEHALF OF YOU WHEN PACKAGES ARE NEEDED

## Code Quality

- **Type Checking**: `bun check` (svelte-check + TypeScript)
- **Formatting**: `bun format` (Prettier)
- **Linting**: `bun lint` (ESLint + Prettier)
- Run lint/typecheck on modified files only before completing changes
- Follow existing patterns: Svelte 5 runes (`$state`, `$derived`), server-only modules in `$lib/server/`

## Project Architecture

```
src/
├── lib/
│   ├── components/     # UI components (shadcn-svelte based)
│   ├── features/       # Feature-scoped components
│   ├── server/         # Server-side modules (auth, github, manifest, post, thread)
│   ├── shared/         # Shared schemas and types
│   └── post.ts, thread.ts, index.ts
├── routes/
│   ├── +layout.svelte  # Global layout with auth
│   ├── +page.svelte    # Feed page
│   ├── api/v1/         # Content API endpoints
│   └── ...
└── app.d.ts            # TypeScript declarations
```

### Key Server Modules

- `lib/server/auth.server.ts` - Better Auth configuration
- `lib/server/github/` - GitHub API fetching with ETag caching
- `lib/server/manifest/` - Manifest fetching and parsing
- `lib/server/post/` - Post fetching (single and batch)
- `lib/server/thread/` - Thread fetching

### Content Structure

Content is stored in a GitHub repository:

- `manifest.json` - Index of standalone posts and threads
- `standalone/*.md` - Individual posts with frontmatter
- `threads/{id}/meta.json` + `posts/*.md` - Threaded posts

## Documentation Updates

- Use the memory tool to update this AGENTS.md file for additional per-project rules
- Minor workflow notes stay local; generalizable patterns worth committing may be added to commit messages

## References

- shadcn-svelte UI components: https://www.shadcn-svelte.com/llms.txt
- svelte: USE SVELTE MCP SERVER
- tailwindcss: USE CONTEXT7 MCP SERVER
