# Integration Guide: Using Beste UI in Block Renderers

Quick checklist for adding a new block that uses a Beste UI component.

## Pre-Implementation Checklist

- [ ] Block name is **canonical** (e.g., `hero`, not `beste-hero`)
- [ ] Canonical data model defined in `src/types/blocks.ts`
- [ ] Beste UI component selected and tested independently
- [ ] You've read `ARCHITECTURE.md` and understand the vendor pattern

## Step 1: Define Canonical Block Type & Data

**File**: `src/types/blocks.ts`

```typescript
export type HeroBlockData = {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  backgroundImage?: string;
  theme?: 'light' | 'dark';
};
```

✅ Use **semantic field names** (e.g., `primaryCtaText`, not `besteCtaButtonLabel`)
✅ Include optional fields that Beste might not require
❌ Do NOT include Beste-specific prop names

## Step 2: Copy Beste UI Component

**Destination**: `src/vendor/beste-ui/[component].tsx`

1. Copy the component file from Beste UI
2. Preserve the original code structure
3. Update imports to use `@/` alias or relative paths
4. Add vendor attribution header:

```typescript
// @vendor: Beste UI
// Source: https://github.com/besteui/components
// Copied and adapted for use in this project

export function BesteHero({ ... }) { ... }
```

✅ Keep vendor files self-contained
❌ Do NOT modify vendor component logic unless necessary

## Step 3: Create Block Folder

**Destination**: `src/blocks/hero/`

Create three files:
- `index.tsx` — Export block definition
- `renderer.tsx` — Wrap vendor component
- `editor.tsx` — Edit canonical data model

### 3a. Renderer

**File**: `src/blocks/hero/renderer.tsx`

```typescript
import React from 'react';
import { BesteHero } from '@/vendor/beste-ui/hero';
import type { HeroBlockData } from '@/types/blocks';

export function renderHero(data: HeroBlockData): React.ReactNode {
  return (
    <BesteHero
      title={data.title}
      subtitle={data.subtitle}
      backgroundImage={data.backgroundImage}
      cta={{
        text: data.primaryCtaText,
        href: data.primaryCtaHref,
      }}
      theme={data.theme}
    />
  );
}
```

✅ Map canonical fields → Beste props
✅ Handle optional fields gracefully
✅ Only import vendor component here
❌ Do NOT import Beste directly elsewhere in the app

### 3b. Editor

**File**: `src/blocks/hero/editor.tsx`

```typescript
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { HeroBlockData } from '@/types/blocks';

export function HeroEditor({
  data,
  onChange,
}: {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label>عنوان</label>
        <Input
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>
      <div>
        <label>زیرعنوان</label>
        <Input
          value={data.subtitle || ''}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </div>
      <div>
        <label>متن دکمه CTA</label>
        <Input
          value={data.primaryCtaText || ''}
          onChange={(e) => onChange({ ...data, primaryCtaText: e.target.value })}
        />
      </div>
      {/* Add more fields as needed */}
    </div>
  );
}
```

✅ Edit **canonical fields**, not Beste-specific props
✅ Use existing UI components from `@/components/ui/`
❌ Do NOT edit Beste component props

### 3c. Block Definition

**File**: `src/blocks/hero/index.tsx`

```typescript
import { renderHero } from './renderer';
import { HeroEditor } from './editor';

export const HeroBlockDef = {
  type: 'hero',
  label: 'Hero',
  defaultData: {
    title: 'عنوان اصلی',
    subtitle: 'توضیح کوتاه',
    primaryCtaText: 'شروع کنید',
    primaryCtaHref: '#',
    backgroundImage: undefined,
    theme: 'light' as const,
  },
  renderer: renderHero,
  editor: HeroEditor,
};
```

## Step 4: Register Block

**File**: `src/blocks/registry.ts`

```typescript
import { HeroBlockDef } from './hero';

registerBlock('hero', HeroBlockDef);
```

✅ Register with **canonical type name** (`'hero'`)
❌ Do NOT register with Beste type names

## Step 5: Test

- [ ] Page builds without errors
- [ ] Builder loads with new block available
- [ ] Can add the block to the page
- [ ] Block data edits persist to localStorage
- [ ] Preview page renders the block
- [ ] Up/Down buttons work correctly

## Step 6: Document

Update the vendor inventory:

**File**: `src/vendor/beste-ui/README.md`

```markdown
| Component | Purpose | Source | Status |
|-----------|---------|--------|--------|
| hero | Hero section | Beste UI | ✅ Implemented |
```

## Checklist Summary

- [ ] Canonical block type defined
- [ ] Canonical data model in `src/types/blocks.ts`
- [ ] Beste component copied to `src/vendor/beste-ui/`
- [ ] Block folder created with renderer, editor, index
- [ ] Block registered in `src/blocks/registry.ts`
- [ ] All imports use `@/` alias or relative paths
- [ ] No Beste imports outside renderer
- [ ] No Beste-specific props in data model
- [ ] Editor edits canonical fields only
- [ ] Build succeeds
- [ ] Tests pass

## Common Mistakes

❌ **Storing Beste prop names in data model**
```typescript
// WRONG
type MyBlockData = {
  besteComponentPropA: string;
  besteComponentPropB?: number;
};
```

✅ **Use semantic names**
```typescript
type MyBlockData = {
  title: string;
  description?: string;
};
```

---

❌ **Importing Beste directly in editor or store**
```typescript
// WRONG (in editor.tsx)
import { BesteHero } from '@/vendor/beste-ui/hero';
```

✅ **Only import in renderer**
```typescript
// RIGHT (in renderer.tsx)
import { BesteHero } from '@/vendor/beste-ui/hero';

// editor.tsx only edits canonical data
```

---

❌ **Registering with vendor type**
```typescript
registerBlock('beste-hero-7', { ... });
```

✅ **Use canonical type**
```typescript
registerBlock('hero', { ... });
```

---

## Need Help?

- Architecture pattern: See `ARCHITECTURE.md`
- Block types & data models: See `src/types/blocks.ts`
- Existing blocks: Check `src/blocks/heading/`, `src/blocks/paragraph/`
- Vendor notes: See `src/vendor/beste-ui/README.md`
