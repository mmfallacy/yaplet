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

## Refactor `src/lib/posts.ts` into Modular Files

### Step 1: Create `src/lib/types.ts`

- [ ] Rename `src/lib/types/post.ts` to `src/lib/types.ts`
- [ ] Add `Manifest` interface from `posts.ts` to `src/lib/types.ts`

### Step 2: Create `src/lib/post.ts`

- [ ] Extract: `postsCache`, `fetchPosts()`, `getPostsWithThreads()`, `getPostById()`, `getPostsByThreadId()`, `getFirstPostByThreadId()`, `getFeedPosts()`, `getFeedPostsCollapsed()` to `src/lib/post.ts`
- [ ] Import types from `types.ts` in `src/lib/post.ts`

### Step 3: Create `src/lib/thread.ts`

- [ ] Extract: `threadsCache`, `fetchThreads()`, `getThreadById()` to `src/lib/thread.ts`
- [ ] Import `Manifest` from `types.ts` in `src/lib/thread.ts`

### Step 4: Create `src/lib/parser.ts`

- [ ] Extract: `parseFrontmatter()`, `fetchMarkdownFile()`, `parseMarkdownPost()` to `src/lib/parser.ts`

### Step 5: Update `src/lib/utils.ts`

- [ ] Append: `searchPosts()`, `filterByDateRange()`, `formatDate()`, `validateContent()`, `MAX_CHARS` to `src/lib/utils.ts`

### Step 6: Delete `src/lib/posts.ts`

- [ ] Delete `src/lib/posts.ts`

### Step 7: Update imports in 6 files:

- [ ] Update import in `src/routes/thread/[threadId]/+page.svelte` to `from '$lib/post'`
- [ ] Update import in `src/routes/post/[postId]/+page.svelte` to `from '$lib/post'`
- [ ] Update import in `src/routes/+page.svelte` to `from '$lib/post'`
- [ ] Update import in `src/lib/components/ThreadPreview.svelte` to `from '$lib/utils'`
- [ ] Update import in `src/lib/components/CommentsSection.svelte` to `from '$lib/utils'`
- [ ] Update import in `src/lib/components/PostCard.svelte` to `from '$lib/utils'`
