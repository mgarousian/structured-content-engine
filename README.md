# Structured Content Engine

A shared block-based content engine for AI-assisted publishing workflows.

This project started as a simple RTL page builder, but its direction is evolving into a structured content engine that can support different publishing products on top of the same core.

The first two product directions are:

* Blog Publishing Workflow
* Landing Page Generation Workflow

Both workflows should share the same core infrastructure: block model, editor, renderer, theme system, and publishing layer.

---

## Product Direction

The goal is not just to build another visual page builder.

The goal is to create a system where users can move from idea, strategy, or business context to structured, editable, publishable content.

AI can help generate the first draft or structure, but the final review and publishing decision stays with the human/admin.

---

## Core Concept

Every page is represented as structured JSON made of reusable blocks.

Example:

```json
{
  "id": "demo",
  "slug": "demo",
  "title": "Demo Page",
  "blocks": [
    {
      "id": "block-1",
      "type": "heading",
      "data": {
        "text": "عنوان اصلی صفحه",
        "level": "h1"
      }
    },
    {
      "id": "block-2",
      "type": "paragraph",
      "data": {
        "text": "این یک پاراگراف نمونه برای محتوای صفحه است."
      }
    }
  ]
}
```

The editor, renderer, preview page, and future publishing flows all work from this structured block model.

---

## Current Status

Implemented:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand store
* RTL-first layout
* Vazirmatn typography
* Block registry architecture
* Heading block
* Paragraph block
* Image block
* Block selection
* Block editing
* Inline block insertion
* Block deletion
* Block reordering with Up/Down controls
* localStorage persistence
* Public preview page

Current demo routes:

```txt
/builder/demo
/page/demo
```

---

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the builder:

```txt
http://localhost:3000/builder/demo
```

Open the public preview:

```txt
http://localhost:3000/page/demo
```

---

## Current Demo

The current demo lets you:

* Add blocks inline between existing blocks
* Edit block content
* Delete blocks
* Move blocks up and down
* Persist changes in localStorage
* Preview the rendered page without editor UI

Current available blocks:

* Heading
* Paragraph
* Image

---

## Architecture Direction

The project should keep a clear separation between:

### Core

Shared infrastructure used by all product lines.

Examples:

* Block model
* Block registry
* Editor
* Renderer
* Theme system
* Publishing system
* Media handling
* AI services
* Scheduling

### Product Lines

Different workflows built on top of the shared core.

Initial product lines:

* Blog
* Landing

Each product line can have its own allowed blocks, AI flow, templates, and publishing logic, while still using the same core engine.

---

## Blog Workflow Direction

The blog workflow should help admins produce editorial content faster.

Possible future flow:

```txt
Content Strategy
→ Topic Ideas
→ Central Idea Extraction
→ AI Draft Generation
→ Human Review
→ Scheduled Publishing
→ Published Blog Post
```

Future capabilities may include:

* Content strategy generation
* Topic clustering
* Editorial calendar
* Draft queue
* Scheduled publishing
* SEO suggestions
* Blog-specific blocks

Possible blog blocks:

* Heading
* Paragraph
* Image
* Quote
* Table of Contents
* Author Bio
* Related Posts
* CTA

---

## Landing Workflow Direction

The landing workflow should help users generate campaign or business pages from guided input.

Possible future flow:

```txt
Guided Wizard
→ Business Context
→ AI Scenario Suggestions
→ Landing Structure Generation
→ Human Review
→ Publish
```

Future capabilities may include:

* Landing page wizard
* Scenario generation
* Industry-specific recommendations
* Conversion-focused sections
* Lead capture blocks
* Landing-specific themes
* A/B variations

Possible landing blocks:

* Hero
* Features
* Process
* Testimonials
* FAQ
* CTA
* Pricing
* Countdown
* Lead Form

---

## Block Availability by Product Line

Not every block should be available everywhere.

The core block registry should eventually support product-specific availability.

Example:

```ts
{
  type: "hero",
  label: "Hero",
  availableFor: ["landing"]
}
```

```ts
{
  type: "authorBio",
  label: "Author Bio",
  availableFor: ["blog"]
}
```

Shared blocks such as Heading, Paragraph, Image, and Button can be available in both workflows.

---

## Theme Direction

The theme system should belong to the core, not to a single product line.

Future themes may control:

* Typography
* Colors
* Spacing
* Radius
* Block rhythm
* Component styling

Blog and Landing can use different theme presets, but they should share the same underlying theme engine.

---

## Current Limitations

This is still an early MVP.

Current limitations:

* Data is stored in localStorage
* No backend yet
* No authentication
* No real publishing workflow
* No scheduling
* No AI integration yet
* No media upload
* No theme system yet
* No separate Blog/Landing routes yet

---

## Near-Term Roadmap

Recommended next steps:

1. Stabilize the current core editor
2. Add Button block
3. Add basic block grouping/categorization
4. Add page kind/type: `blog` or `landing`
5. Filter available blocks based on page kind
6. Create separate routes for Blog and Landing editors
7. Start defining the Blog Pipeline
8. Start defining the Landing Pipeline
9. Introduce a simple theme model
10. Move from localStorage to a persistent backend when the core model is stable

---

## Long-Term Vision

Structured Content Engine should become a shared foundation for AI-assisted publishing.

The system should help users move from raw intent to structured content, from structured content to editable pages, and from editable pages to published outputs.

The value is not only in editing blocks.

The value is in the full pipeline:

```txt
Idea
→ Structure
→ AI Draft
→ Human Review
→ Theme
→ Publish
```
