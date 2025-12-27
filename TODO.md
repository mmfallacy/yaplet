# SvelteKit Migration TODO

## 🟢 Completed
- [x] Initialize SvelteKit project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up shadcn-svelte
- [x] Migrate static content (`public/content/` -> `static/content/`)
- [x] Migrate base types (`src/types/post.ts` -> `src/lib/types/post.ts`)
- [x] Migrate utility functions (`src/lib/utils.ts`)
- [x] Migrate `use-mobile` hook (`src/lib/hooks/is-mobile.svelte.ts`)
- [x] Migrate ALL shadcn-svelte components
- [x] Migrate custom components:
    - Header, NavLink, ThemeToggle, UserMenu, PostCard, PostActions, PostImages, CommentsSection, MarkdownRenderer, SearchFilter, ThreadPreview
- [x] Migrate hooks & state management:
    - `auth.svelte.ts`, `theme.svelte.ts`
- [x] Migrate library logic (`posts.ts`)
- [x] Implement routes:
    - Feed (`/`), Login (`/login`), PostPage (`/post/[id]`), ThreadPage (`/thread/[id]`), NotFound (`+error.svelte`)
- [x] Setting up base layout and navigation

- [x] Polishing and final verification (Olive green accent, fonts, Lucide icons)

## 🔴 Pending
- [ ] Production build check
