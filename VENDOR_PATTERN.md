# Vendor Pattern: Design Principles

## Problem Statement

**Beste UI** is a beautiful component library, but we don't want to become architecturally dependent on it. If we switch UI libraries later or build our own, we need the ability to do so **without rewriting the entire editor, store, or page model**.

## Solution: Vendor Pattern

We separate **product concerns** (canonical blocks, data models, editors) from **presentation concerns** (UI implementations).

### Core Principle

> **Canonical blocks are the source of truth. UI implementations are replaceable.**

## Design Decisions

### 1. Canonical Block Types
All blocks have semantically meaningful types: `heading`, `paragraph`, `image`, `hero`, `faq`, `cta`.

Never use vendor-specific type names like `beste-hero-7` or `BesteTabsv2`.

**Why?** The block registry, storage, and editor must be vendor-agnostic.

### 2. Canonical Data Models
Each block has a semantic data model defined once in `src/types/blocks.ts`.

```typescript
type HeroBlockData = {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  backgroundImage?: string;
};
```

This is the **contract** between the editor and renderer.

**Why?** Editors and storage don't care about UI implementation. They only care about meaningful content.

### 3. Vendor Isolation
Beste UI components live in `src/vendor/beste-ui/` and are **only imported in block renderers**.

```typescript
// ✅ OK: Import in renderer
import { BesteHero } from '@/vendor/beste-ui/hero';

// ❌ NOT OK: Import in editor, store, or page model
import { BesteHero } from '@/vendor/beste-ui/hero'; // in editor.tsx — WRONG
```

**Why?** The rest of the app remains unaware of vendor choices. Changing vendors only requires updating renderers.

### 4. Renderer as Adapter
Each block's renderer is a **thin adapter** between canonical data and vendor component props.

```typescript
// src/blocks/hero/renderer.tsx
export function renderHero(data: HeroBlockData): React.ReactNode {
  return (
    <BesteHero
      title={data.title}
      subtitle={data.subtitle}
      cta={{
        text: data.primaryCtaText,
        href: data.primaryCtaHref,
      }}
    />
  );
}
```

**Why?** If we switch from Beste to another library, we only update the renderer. The canonical data model and editor stay the same.

### 5. Editor Only Understands Canonical Model
Editors are built to edit canonical fields, not vendor-specific props.

```typescript
// ✅ OK: Edit canonical field
onChange({ ...data, title: e.target.value })

// ❌ NOT OK: Edit vendor-specific field
onChange({ ...data, besteComponentPropA: e.target.value })
```

**Why?** Editors are independent of UI implementation. Any editor can work with any renderer.

## Integration Boundaries

| Component | Knows About | Doesn't Know About |
|-----------|-------------|-------------------|
| **Block Registry** | Canonical types (`hero`, `paragraph`) | Vendor types (`beste-hero`) |
| **Editor** | Canonical data models | Vendor component props |
| **Renderer** | Vendor component APIs | Other renderers, editors, store |
| **Store** | Canonical blocks and data | Any vendor components |
| **Page JSON** | Canonical types and data | Vendor-specific info |

## Architectural Benefits

### Switching UI Libraries
If we want to use **Material-UI** instead of Beste UI:
1. Create `src/vendor/material-ui/`
2. Copy Material components there
3. Update renderers to use Material components
4. Done! No changes to block types, editors, or store.

### Building Our Own Components
If we want to replace Beste with **our custom components**:
1. Create `src/ui/` with our own components
2. Update renderers to import from `src/ui/` instead of vendor
3. Done! Everything else stays the same.

### Multi-Source UI
If we want to use multiple UI libraries:
- Keep `src/vendor/beste-ui/` for some blocks
- Create `src/vendor/our-ui/` for others
- Each renderer imports from whichever source is appropriate
- Canonical blocks and editors are unaffected

## Practical Workflow

### Adding a Block with Beste UI

1. **Define canonical type & data** in `src/types/blocks.ts`
2. **Copy vendor component** to `src/vendor/beste-ui/[name].tsx`
3. **Create renderer** in `src/blocks/[name]/renderer.tsx` (maps data → props)
4. **Create editor** in `src/blocks/[name]/editor.tsx` (edits canonical data)
5. **Register block** in `src/blocks/registry.ts` with canonical type
6. **Done!** The rest of the app is unaware of the vendor.

### Replacing Beste with Another Library

1. Copy new vendor components to `src/vendor/new-lib/`
2. Update renderers to import from new vendor (change 1 line per renderer)
3. Remove `src/vendor/beste-ui/`
4. Done!

## Implementation Checklist

When adding a new Beste-backed block:

- [ ] Canonical type is semantic (not `beste-*`)
- [ ] Data model is in `src/types/blocks.ts`
- [ ] Vendor component is copied to `src/vendor/beste-ui/`
- [ ] Renderer only imports vendor component (no other imports of vendor code)
- [ ] Editor only edits canonical data (no vendor-specific fields)
- [ ] Registry uses canonical type name
- [ ] No vendor imports outside of renderers

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Overall system design
- [VENDOR_INTEGRATION.md](./VENDOR_INTEGRATION.md) — Step-by-step integration guide
- [VENDOR_TEMPLATE.tsx](./VENDOR_TEMPLATE.tsx) — Template for new blocks
- [src/vendor/beste-ui/README.md](./src/vendor/beste-ui/README.md) — Vendor inventory

## FAQs

**Q: Can I import Beste directly in a block editor?**
A: No. Editors only edit canonical data. If you need to import something, import it in the renderer as an adapter.

**Q: What if Beste UI doesn't have a component I need?**
A: Create a custom renderer that combines Beste components or uses custom HTML. The rest of the app still uses canonical types.

**Q: Do we need to copy Beste UI, or can we use it as an npm dependency?**
A: Currently we copy (vendor) for control and minimal dependency footprint. Using npm is an option if the project grows, but vendor approach is safer for MVP.

**Q: What if our canonical data model changes?**
A: Update `src/types/blocks.ts`, editors, and renderers. No other code is affected (assuming vendor isolation is maintained).

**Q: Can we have multiple renderers for the same block?**
A: Yes, but it would require parallel block types or a theme system. For now, one canonical block = one renderer = one presentation.
