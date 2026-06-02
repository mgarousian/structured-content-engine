# Copilot Instructions

We are building an MVP block-based page builder using Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, dnd-kit, and localStorage.

The product is primarily for Persian/Farsi users.

Core requirements:
- RTL is the default direction.
- Persian UI labels by default.
- Pages are built from vertically stacked blocks.
- A page is stored as JSON.
- Blocks can be added, edited, reordered, deleted, saved to localStorage, and rendered in preview.

MVP only:
- No backend
- No database
- No auth
- No upload system
- No dashboard
- No rich text editor
- No nested layouts
- No theme system

Routes:
- /builder/demo
- /page/demo

Architecture:
Use a block registry. Do not use large switch statements.

Each block should have:
- type
- label
- defaultData
- renderer
- editor

Initial blocks:
- Heading
- Paragraph
- Image
- Button
- Gallery
- FAQ

Use a clean folder structure under src/blocks.

Use Zustand for editor state:
- currentPage
- selectedBlockId
- addBlock
- updateBlock
- deleteBlock
- reorderBlocks
- loadFromStorage
- saveToStorage

Use dnd-kit for reordering.

Keep the implementation simple, readable, and incremental.