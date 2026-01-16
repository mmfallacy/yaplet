# Manual Refactoring to improve code quality

## Goals:

- Refactor core logic and separation of concerns
- Frontend refactor only when necessary, no need to perfect the frontend-code unless it introduces performance issues
- Prepare refactor for moving over GitHub raw.githubusercontent.com to actual GitHub API.
- Prepare refactor to create local content source for development. (Perhaps use git-backed only then pull in repository via Git instead of GitHub API).

## Notes:

- hooks.server.ts
  - Is `events.local` server-side only?
- auth.server.ts
  - Check if extracting options and merging it with customSession is necessary for my use case
  - [https://www.better-auth.com/docs/concepts/session-management#customizing-session-response]
- post.ts
  - Are the schemas correct? Essentially we're transforming object created by parsing with marked to fit PostSchema.
  - Are there zod transforms instead of running a mapToPost function?

  - Extract fetching of manifest onto own function. Consider storing manifest onto a svelte-store
  - Unify concept of posts and threads. Create Post and Thread type.
  - fetchers should include:
    - fetchStandalone
    - fetchThreads
    - fetch

- manifest.json
  - make manifest auto generated via a script. Include createdAt date to easily get recent X posts.

- Flow:

```py
manifest = fetch_manifest() # under the hood, fetch(api/content/manifest.json) and zod parse

posts = fetch_posts(manifest.standalone) # under the hood, calls fetch(api/content/standalone/*) for all posts in argument

for thread in manifest.threads:
  thread = fetch_thread() # under the hood, fetch(api/content/threads/*)
  posts = fetch_posts(thread.posts)
```

- yaplet-content
  - ~~track contents onto database to enable sorted, or should i track it in an automatically generated file within the repo so upon clone so no need to have two sources of truth~~
  - use github api. leverage Repository Contents 304 not modified so no need to requery when posts arent modified.
  - why not place manifest.json into the postgres neon table so its easy to query. Link instead the github api url and make generate-manifest push to the db

- Consider running errors as return values instead of exceptions. Where's the edge boundary though? (outermost layer in our handling s.t. it still runs exceptions)
- What if we do:
  - +server.ts GET POST PUT etc. run errors as exceptions.
  - internal $/lib/server/manifest.ts and $/lib/server/post.ts does error as values.
  - Need a way to structure $/lib/server/\* properly.

## TODO

- [ ] Plan how to incrementally refactor this without breaking everything.
- [ ] auth.svelte.ts: Add deprecation warning on import
- [x] post.ts: Extract schemas onto schema.ts
- [ ] enable prerenders
- [x] github.server.ts: add api based fetching
- [x] github.server.ts: add checking etag for not modified
- [ ] github.server.ts: add on disk caching
- [x] errors as return values for features
- [x] keep errors as exceptions for HTTP handlers

- [x] manifest.ts: fetchManifest()
- [x] yaplet-content: generate-manifest.ts: Generate manifests given repository.
- [x] api/v1/post/[id]: fetchPost(id)
- [x] api/v1/: fetchPosts(id[])
- [x] threads.ts: fetchThread()

- [x] feed: get feed and respect limits and offsets.

- [ ] let GET / use new services
- [/] render marked server side for seo. Sanitize client side for good measures
