# TODO: Migrate Static Content to GitHub Repository

This file outlines the tasks required to migrate static content from the local `static/content/` directory to an external private GitHub repository.

## Project Context

This is a SvelteKit application that currently loads content from the local `static/content/` directory at runtime. The goal is to migrate to loading content from a private GitHub repository using a server-side proxy for security.

## Key Decisions Made

### Architecture

- **Approach:** Server-side proxy with in-memory caching
- **Security:** GITHUB_PAT stored server-only, never exposed to frontend
- **Content Source:** Private GitHub repository via raw.githubusercontent.com
- **Endpoint Structure:** Proxy at `/api/content/*`

### Caching Strategy

- **Type:** In-memory cache
- **TTL:** 8 hours
- **Invalidation:** GitHub Webhooks (automatic on content push)

### Error Handling

- Primary: Show error to user when content fails to load
- Fallback: Serve from in-memory cache if available (stale content better than no content)

### Environment Variables (All Server-Side Only)

```bash
# Required - GitHub PAT with repo or public_repo scope (read-only)
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx

# Required - Base URL for content (raw.githubusercontent.com format)
CONTENT_BASE_URL=https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/{path}

# Required - Secret for webhook authentication
WEBHOOK_SECRET=your-webhook-secret-here
```

## Implementation Requirements

### Phase 1: Environment & Configuration

- [x] Create/update .env.example with GITHUB_PAT, CONTENT_BASE_URL, WEBHOOK_SECRET
- [x] Document required GitHub PAT scope (repo or public_repo, read-only)
- [x] Document webhook setup process

#### GitHub PAT Scope Requirements

The `GITHUB_PAT` (Personal Access Token) requires one of the following scopes:

- **Private repositories:** `repo` scope (full control of private repositories)
- **Public repositories only:** `public_repo` scope (read-only access to public repositories)

Create a token at: https://github.com/settings/tokens

The token should be read-only for security purposes - it only needs to read raw content files.

#### Webhook Setup Process

1. **Create GitHub Actions workflow** (see Phase 4) to trigger cache invalidation on content push

2. **Configure webhook in your GitHub content repository:**
   - Go to: Repository Settings > Webhooks > Add webhook
   - Payload URL: `https://your-domain.com/api/webhook/cache`
   - Content type: `application/json`
   - Secret: Use the value of `WEBHOOK_SECRET` environment variable
   - Events: Select "Just the push event"
   - Optionally filter to only trigger on changes to the `content/` directory

### Phase 2: Server-Side Infrastructure

- [x] Create `src/lib/server/github.ts`:
  - GitHub content client with raw.githubusercontent.com
  - In-memory cache with 8-hour TTL (use Map with timestamps)
  - Cache invalidation method (clear all or by path)
  - Error handling with cache fallback

- [x] Create `src/routes/api/content/[...path]/+server.ts`:
  - Proxy endpoint that accepts `/api/content/*`
  - Forwards request to GitHub raw URL
  - Returns cached response if available and not expired
  - Caches successful responses
  - Handles errors gracefully

- [x] Create `src/routes/api/webhook/cache/+server.ts`:
  - Webhook endpoint for GitHub push events
  - Validates webhook signature (HMAC-SHA256)
  - Clears cache on valid push to content directory
  - Returns appropriate HTTP status codes

### Phase 3: Frontend Integration

- [x] Update `src/lib/post.ts`:
  - Change `/content/manifest.json` to `/api/content/manifest.json`
  - Change `/content/standalone/*` to `/api/content/standalone/*`
  - Change `/content/threads/*` to `/api/content/threads/*`
  - Add error handling with cache fallback message

- [x] Update `src/lib/thread.ts`:
  - Change `/content/manifest.json` to `/api/content/manifest.json`
  - Change `/content/threads/*/meta.json` to `/api/content/threads/*/meta.json`
  - Add error handling with cache fallback message

### Phase 4: GitHub Actions & Webhooks

- [ ] Create `.github/workflows/trigger-cache-invalidation.yml`:
  - Workflow that runs on push to content directory
  - Sends POST request to webhook endpoint
  - Includes webhook secret in Authorization header

- [ ] Document webhook configuration steps:
  - GitHub repo settings > Webhooks > Add webhook
  - Payload URL: `https://your-domain.com/api/webhook/cache`
  - Content type: `application/json`
  - Secret: `WEBHOOK_SECRET` value
  - Events: Push events only, filter to content directory

### Phase 5: Testing & Documentation

- [ ] Test content loading from GitHub in development
- [ ] Test cache behavior (TTL expiration)
- [ ] Test cache invalidation via webhook
- [ ] Test error handling (network failure, invalid token)
- [ ] Test fallback to cached content on error
- [ ] Document the entire setup process
- [ ] Update `README.md` with new content configuration

## Important Notes

1. `GITHUB_PAT` must NEVER be exposed to the frontend (client-side code)
2. All content fetching goes through `/api/content/*` proxy endpoints
3. Cache serves stale content if GitHub fetch fails (user sees content, not error)
4. Webhook only clears cache, doesn't trigger full rebuild
5. GitHub Actions workflow triggers the webhook on content push

## Placeholders to Replace Later

- `{owner}` - GitHub organization or username
- `{repo}` - Repository name
- `{branch}` - Branch name (typically main or master)
- `{path}` - Path prefix for content (e.g., `content/`)
- `your-domain.com` - Production domain
