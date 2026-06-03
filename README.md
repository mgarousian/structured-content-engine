# Structured Content Engine

A modular block-based content engine for building editable and publishable content.

The project uses one shared editor core for different content modules.
Current modules:

* Blog
* Landing Page

The goal is to avoid building separate editors for every product. Blog and Landing use the same core editor, renderer, storage layer, and block registry, but each module can define its own allowed blocks and workflow.

---

## Current Branch

```txt
feature/content-type-modules
```

This branch adds module separation for Blog and Landing while keeping the editor core shared.

---

## Core Features

Implemented:

* Shared block editor
* Block registry
* Blog module
* Landing module
* Module-specific allowed blocks
* Dynamic builder routes
* Dynamic preview routes
* localStorage document storage
* Admin list pages
* RTL layout
* Vazirmatn typography

Current blocks:

* Heading
* Paragraph
* Image
* Hero

---

## Routes

Admin entry:

```txt
/admin
```

Module lists:

```txt
/admin/blog
/admin/landing
```

Builder:

```txt
/builder/blog/:id
/builder/landing/:id
```

Preview:

```txt
/page/blog/:id
/page/landing/:id
```

---

## Module Rules

### Blog

Allowed blocks:

* Heading
* Paragraph
* Image

Hero is not available in Blog.

### Landing

Allowed blocks:

* Heading
* Paragraph
* Image
* Hero

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

Blog:

```txt
/admin → Blog → Create New Blog Post → Edit → Preview
```

Landing:

```txt
/admin → Landing → Create New Landing Page → Edit → Preview
```

Expected:

* Blog and Landing use the same editor core.
* Each module shows only its allowed blocks.
* Documents persist in localStorage.
* Preview renders without editor UI.

---

## Architecture Principle

AI should not generate UI or code.

AI should generate structured content.
The core engine handles editing, rendering, validation, themes, and publishing.

---

## Near-Term Roadmap

* Stabilize admin navigation
* Improve document list behavior
* Add block metadata and categories
* Improve Add Block modal organization
* Add more Blog and Landing blocks
* Define simple theme model
* Define AI output contracts for Blog and Landing
