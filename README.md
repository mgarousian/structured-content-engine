# RTL Page Builder

A block-based page builder MVP for Persian (RTL) websites and landing pages.

## Current Status

Implemented:

* Block Registry Architecture
* Heading Block
* Paragraph Block
* Zustand Store
* Block Selection
* Block Editing
* RTL-first UI

Work in Progress:

* LocalStorage Persistence
* Add Block Flow
* Delete Block
* Drag & Drop
* Preview Page

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/builder/demo
```

This is the current demo page and the main entry point for testing the builder.

## Current Demo

The demo currently includes:

* Heading block
* Paragraph block
* Block selection
* Basic editing through the editor panel

The goal of the current milestone is validating the core page builder architecture before adding more block types.

## Roadmap

1. LocalStorage Persistence
2. Add Block Flow
3. Delete Block
4. Drag & Drop Reordering
5. Preview Page
6. Additional Blocks (Image, FAQ, Gallery, Hero, etc.)

## Vision

Build a lightweight block-based page builder optimized for Persian content.

Pages are composed of reusable blocks and stored as structured JSON.

The editor is RTL-first and designed around a registry-driven architecture that can later support landing pages, blog posts, product pages, and other content types.
