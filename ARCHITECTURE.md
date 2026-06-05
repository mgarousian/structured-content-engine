# Architecture

## Purpose

Structured Content Engine is currently a blog-only structured content engine.

It is designed to create, edit, store, and render blog posts as structured JSON content rather than Markdown documents.

---

## Core Principles

- Content is modeled as structured JSON blocks.
- Blocks are limited by a controlled block registry.
- Rendering is controlled by the application, not raw user-authored HTML.
- Storage is file-based and optimized for local, static, personal, and self-hosted workflows.
- UI should use `shadcn/ui` primitives and Tailwind conventions.
- Avoid arbitrary manual styling when existing UI primitives and patterns are sufficient.

---

## Current Layers

- **Public blog pages** render the blog index and blog detail routes.
- **Admin blog management** handles blog listing and CRUD workflows.
- **Structured editor** manages block-based blog post editing.
- **Block system** defines available block types and their rendering behavior.
- **Storage adapter** persists and loads blog documents from JSON files.

---

## Current Content Model

Each blog post is stored as a structured JSON document with this shape:

```ts
{
  id: string;
  module: 'blog';
  contentType: 'blogPost';
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  publishedAt?: string;
  updatedAt: string;
  blocks: Array<unknown>;
}
```

Key fields:

- `id`
- `module: blog`
- `contentType: blogPost`
- `title`
- `slug`
- `excerpt`
- `status`
- `publishedAt`
- `updatedAt`
- `blocks`

---

## Current Blocks

The current blog editor supports these block types:

- Heading
- Paragraph
- Image

These blocks are used in both editing and rendering flows.

---

## Storage

Blog Storage v1 uses file-based JSON storage:

```txt
content/blog/*.json
```

This storage model is suitable for local, static, personal, and self-hosted usage.

It is not the final SaaS storage architecture.

Related routes in the current system:

```txt
Public:
/blog
/blog/:slug

Admin and editor:
/admin
/admin/blog
/builder/blog/:id
/page/blog/:id

API:
/api/blog-documents
/api/blog-documents/:id
```

---

## Out Of Scope

The following are explicitly out of scope in the current branch:

- Landing pages
- Hero block
- Beste UI or vendor-pattern integration
- AI pipeline
- SaaS storage
- Authentication
- Full admin platform
- Slash-command editor

---

## Future Direction

- The admin shell can later become reusable across multiple products.
- The blog editor can later become more writing-focused, closer to Notion-style block insertion.
- The shared structured-content model can later be reused across separate repositories or products.
