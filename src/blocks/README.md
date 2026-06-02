Suggested folder structure for blocks

Each block should live in its own folder under `src/blocks`.

Example layout:

- src/blocks/
  - heading/
    - index.ts          # exports the block definition (type, label, defaultData)
    - renderer.tsx      # (optional) React renderer for preview
    - editor.tsx        # (optional) React editor component
  - paragraph/
  - image/
  - button/
  - gallery/
  - faq/

Shared registry and types:
- src/blocks/registry.ts  # block registry (this file)
- src/types/blocks.ts     # core types for blocks and pages

Notes:
- Keep block definitions small and export a single default `BlockDefinition`.
- Avoid large switch statements by registering blocks via `registerBlock()`.
