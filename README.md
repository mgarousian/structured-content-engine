# Structured Content Engine

A blog-only structured content engine for creating, editing, storing, and rendering block-based blog content.

The current branch focuses on Blog Storage v1 with file-based JSON storage and public blog rendering.

---

## Current Focus

Implemented:

* Blog admin list and CRUD flow
* Blog editor with structured blocks
* File-based JSON storage
* Public blog list page
* Public blog detail pages
* Controlled rendering from structured content

Not included in this branch:

* Non-blog page implementation
* AI pipeline
* SaaS storage
* Authentication

---

## Routes

Admin:

```txt
/admin
/admin/blog
```

Builder:

```txt
/builder/blog/:id
```

Preview:

```txt
/page/blog/:id
```

Public blog:

```txt
/blog
/blog/:slug
```

---

## Storage

Blog posts are stored as file-based JSON documents:

```txt
content/blog/*.json
```

This storage model is intended for local, static, and personal usage.

---

## Blocks

Current blog blocks:

* Heading
* Paragraph
* Image

The editor stores content as structured JSON blocks, not Markdown.

---

## Development Principles

* Content is represented as structured JSON blocks.
* Rendering is controlled by the application.
* File storage is the current persistence layer.
* This branch does not include a landing-page implementation.
* This branch does not include an AI pipeline.
* This branch does not include SaaS storage or authentication.

---

## Run Project

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/admin
```

---

## Test Flow

Blog admin:

```txt
/admin → Blog → Create New Blog Post → Edit → Preview
```

Public blog:

```txt
/blog → Blog Post Detail
```

Expected:

* Blog posts persist as JSON files under `content/blog`.
* The editor uses structured blocks.
* Preview and public pages render without editor UI.
