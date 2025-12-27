# SvelteKit Migration TODO

## 🟢 Completed
- [x] Initialize SvelteKit project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up shadcn-svelte
- [x] Migrate static content (`public/content/` -> `static/content/`)
- [x] Migrate base types (`src/types/post.ts` -> `src/lib/types/post.ts`)
- [x] Migrate utility functions (`src/lib/utils.ts`)
- [x] Migrate `use-mobile` hook (`src/lib/hooks/is-mobile.svelte.ts`)
- [x] Migrate ALL shadcn-svelte components:
    - Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, Context Menu, Data Table, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Range Calendar, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle Group, Tooltip

## 🟡 In Progress
- [ ] Setting up base layout and navigation

## 🔴 Pending

### Custom Components
- [ ] `Header.svelte`
- [ ] `NavLink.svelte`
- [ ] `ThemeToggle.svelte`
- [ ] `UserMenu.svelte`
- [ ] `PostCard.svelte`
- [ ] `PostActions.svelte`
- [ ] `PostImages.svelte`
- [ ] `CommentsSection.svelte`
- [ ] `MarkdownRenderer.svelte`
- [ ] `SearchFilter.svelte`
- [ ] `ThreadPreview.svelte`

### Hooks & State Management
- [ ] `useAuth` -> `auth.svelte.ts` (or Svelte store)
- [ ] `useTheme` -> Svelte implementation

### Library Logic
- [ ] `posts.ts` -> SvelteKit data fetching logic (Server-side or Client-side)

### Routes & Pages
- [ ] `Feed` -> `routes/+page.svelte`
- [ ] `Login` -> `routes/login/+page.svelte`
- [ ] `PostPage` -> `routes/post/[id]/+page.svelte`
- [ ] `ThreadPage` -> `routes/thread/[id]/+page.svelte`
- [ ] `NotFound` -> `routes/+error.svelte`
