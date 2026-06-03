# Vendor Integration Template

Use this template as a starting point for adding a Beste-backed block.

## Files to Create

### 1. Define Canonical Data Model

**File**: `src/types/blocks.ts`

Add this type definition:

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

### 2. Copy Vendor Component

**File**: `src/vendor/beste-ui/hero.tsx`

```typescript
// @vendor: Beste UI
// Source: https://github.com/besteui/components
// Copied and adapted for use in this project

export function BesteHero({ title, subtitle, backgroundImage, cta, theme }) {
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button>{cta.text}</button>
    </div>
  );
}
```

### 3. Create Block Folder

Create `src/blocks/hero/` with these three files:

#### 3a. Renderer

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

#### 3b. Editor

**File**: `src/blocks/hero/editor.tsx`

```typescript
import React from 'react';
import { Input } from '@/components/ui/input';
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
          placeholder="عنوان اصلی صفحه"
        />
      </div>

      <div>
        <label>زیرعنوان</label>
        <Input
          value={data.subtitle || ''}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="توضیح کوتاه"
        />
      </div>

      <div>
        <label>متن دکمه CTA</label>
        <Input
          value={data.primaryCtaText || ''}
          onChange={(e) => onChange({ ...data, primaryCtaText: e.target.value })}
          placeholder="شروع کنید"
        />
      </div>

      <div>
        <label>لینک دکمه CTA</label>
        <Input
          value={data.primaryCtaHref || ''}
          onChange={(e) => onChange({ ...data, primaryCtaHref: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label>URL تصویر پس‌زمینه</label>
        <Input
          value={data.backgroundImage || ''}
          onChange={(e) => onChange({ ...data, backgroundImage: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
```

#### 3c. Block Definition

**File**: `src/blocks/hero/index.tsx`

```typescript
import { renderHero } from './renderer';
import { HeroEditor } from './editor';
import type { HeroBlockData } from '@/types/blocks';

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
  } as HeroBlockData,
  renderer: renderHero,
  editor: HeroEditor,
};
```

### 4. Register Block

**File**: `src/blocks/registry.ts`

Add to imports:
```typescript
import { HeroBlockDef } from './hero';
```

Add to registration (inside the file or in a boot function):
```typescript
registerBlock('hero', HeroBlockDef);
```

## Quick Checklist

- [ ] Data model defined in `src/types/blocks.ts`
- [ ] Beste component copied to `src/vendor/beste-ui/hero.tsx`
- [ ] Renderer created: `src/blocks/hero/renderer.tsx`
- [ ] Editor created: `src/blocks/hero/editor.tsx`
- [ ] Block definition created: `src/blocks/hero/index.tsx`
- [ ] Block registered in `src/blocks/registry.ts`
- [ ] Build succeeds (`npm run build`)
- [ ] Block picker shows new block
- [ ] Can add block to page
- [ ] Can edit block data
- [ ] Data persists to localStorage
- [ ] Block renders on preview page

## Tips

1. **Keep vendor imports isolated**: Only import Beste components in `renderer.tsx`
2. **Edit canonical data**: Editors work with `HeroBlockData`, not vendor props
3. **Map data to props**: The renderer adapts canonical data → vendor component props
4. **Semantic types**: Use `'hero'` not `'beste-hero'` for the block type
5. **Follow RTL pattern**: Include Persian labels and RTL support in editor

## Related Documents

- [VENDOR_INTEGRATION.md](./VENDOR_INTEGRATION.md) — Detailed integration guide
- [VENDOR_PATTERN.md](./VENDOR_PATTERN.md) — Design principles
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Overall architecture
- [src/vendor/beste-ui/README.md](./src/vendor/beste-ui/README.md) — Vendor inventory
