# yaplet

A twitter-esque microblogging platform for my short yaps

## Features

- **Markdown Posts** - Write content using Markdown with support for images, footnotes, and tags
- **Threads** - Organize related posts into grouped threads
- **GitHub-Backed Content** - All content is stored in a GitHub repository, version-controlled and easy to manage
- **Search** - Find posts by content, thread title, or tags
- **Theming** - Light and dark mode support
- **Authentication** - GitHub OAuth authentication for users
- **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn-svelte](https://www.shadcn-svelte.com/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Content**: GitHub repository via GitHub API
- **Markdown**: [marked](https://marked.js.org/) with DOMPurify sanitization

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- GitHub Personal Access Token (for content fetching)

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd yaplet

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following variables:

```bash
# GitHub PAT with repo or public_repo scope (read-only)
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx

# Base URL for content (raw.githubusercontent.com format)
CONTENT_BASE_URL=https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/{path}
```

### Development

```sh
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

```sh
bun build
```

Preview the production build:

```sh
bun preview
```

## API Endpoints

| Endpoint                  | Description                 |
| ------------------------- | --------------------------- |
| `GET /api/v1/feed`        | Fetch all posts and threads |
| `GET /api/v1/post/:id`    | Fetch single post by ID     |
| `GET /api/v1/thread/:id`  | Fetch thread by ID          |
| `POST /api/v1/batch/post` | Fetch multiple posts by ID  |

## Content Structure

Content is stored in a separate GitHub repository. The expected structure:

```
content/
├── manifest.json
├── standalone/
│   ├── post-1.md
│   └── post-2.md
└── threads/
    ├── thread-1/
    │   ├── meta.json
    │   └── post-1.md
    └── thread-2/
        ├── meta.json
        └── post-1.md
```

### Manifest Format (`manifest.json`)

```json
{
	"standalone": ["post-1.md", "post-2.md"],
	"threads": ["thread-1", "thread-2"]
}
```

### Thread Metadata (`threads/{id}/meta.json`)

```json
{
	"id": "thread-1",
	"title": "Discussion Title",
	"description": "Brief description",
	"createdAt": "2024-01-01T00:00:00Z",
	"posts": ["post-1.md", "post-2.md"]
}
```

### Post Format (`*.md` with frontmatter)

```markdown
---
createdAt: 2024-01-01T00:00:00Z
images: ['https://example.com/image.jpg']
likes: 42
tags: ['discussion', 'idea']
footnotes:
  note1: 'Footnote content'
---

Your post content here...
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Frontend (SvelteKit)                 │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │ Threads │ │  Posts   │ │   Feed   │ │  Auth   │  │
│  └─────────┘ └──────────┘ └──────────┘ └─────────┘  │
│    │           │              │           │          │
│    └───────────┴──────────────┴───────────┘          │
│                        │                             │
│                        ▼                             │
│              ┌─────────────────────┐                 │
│              │   API Routes        │                 │
│              │   /api/v1/*         │                 │
│              └──────────┬──────────┘                 │
└─────────────────────────┼────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Server Modules (lib/server/)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │  Auth   │ │  GitHub  │ │  Posts   │ │ Threads │  │
│  └─────────┘ └──────────┘ └──────────┘ └─────────┘  │
│                     │                               │
│                     ▼                               │
│              ┌─────────────┐                        │
│              │ GitHub API  │                        │
│              └─────────────┘                        │
└─────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Shared UI components (shadcn-svelte)
│   ├── features/       # Feature-scoped components
│   │   ├── markdown/   # Markdown rendering & sanitization
│   │   ├── post/       # Post-related components
│   │   └── thread/     # Thread-related components
│   ├── server/         # Server-side modules
│   │   ├── auth.server.ts
│   │   ├── github/     # GitHub API & caching
│   │   ├── manifest/   # Manifest fetching
│   │   ├── post/       # Post fetching & processing
│   │   └── thread/     # Thread fetching
│   └── shared/         # Shared schemas & types
├── routes/
│   ├── +layout.svelte  # Global layout with auth
│   ├── +page.svelte    # Feed page
│   ├── api/v1/         # API endpoints
│   ├── post/[postId]/  # Single post page
│   └── thread/[threadId]/  # Thread page
└── app.d.ts
```

Content is fetched server-side via `lib/server/` modules, ensuring your GitHub PAT never leaks to the client.

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun check` - Run TypeScript and Svelte checks
- `bun format` - Format code with Prettier
- `bun lint` - Lint with ESLint and Prettier

## Development

This project uses [Nix](https://nix.dev/) for development environment reproducibility.

```sh
# Enter the dev shell (if Nix is installed)
nix-shell ./nix/devShell.nix

# Or use direnv to automatically load the environment
direnv allow
```

## License

MIT
