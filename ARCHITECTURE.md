# Architecture

## Vendor Pattern & UI Source Independence

### Problem
We want to use **Beste UI** blocks as a temporary UI source while keeping the project **independent** of Beste UI as a core dependency.

### Solution
The **Vendor Pattern** creates a separation between:
- **Canonical block types** (our product model)
- **UI implementations** (replaceable, from vendors like Beste UI)

### Structure

```
src/
├── blocks/                    # Canonical block types (heading, paragraph, image, hero, etc.)
│   ├── heading/
│   ├── paragraph/
│   ├── image/
│   ├── hero/                  # Canonical hero block
│   ├── faq/                   # Canonical FAQ block
│   ├── registry.ts            # Block registry (uses our types, not Beste types)
│   └── README.md
│
├── vendor/                    # Third-party UI components
│   └── beste-ui/              # Copied/adapted Beste UI components
│       ├── hero.tsx           # Beste Hero component (copied, minimal deps)
│       ├── accordion.tsx       # Beste Accordion component
│       └── README.md          # Vendor-specific notes
│
└── types/
    └── blocks.ts              # Canonical block data models

app/
├── builder/                   # Editor (uses our canonical block types)
├── page/                      # Public preview (uses our block registry)
└── layout.tsx
```

### Key Rules

#### 1. **Canonical Block Types**
Our product only understands our own block types:

```typescript
// Canonical types stored in page JSON
type BlockType = 'heading' | 'paragraph' | 'image' | 'hero' | 'faq' | 'cta' | 'features';
```

Do NOT store `type: "beste-hero7"` or `type: "BesteTabs"`.

#### 2. **Canonical Block Data Models**
Each block has a canonical data model independent of UI source:

```typescript
// src/types/blocks.ts
type HeroBlockData = {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  backgroundImage?: string;
  theme?: 'light' | 'dark';
};

type FAQBlockData = {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};
```

The editor and storage only care about these fields.

#### 3. **Renderer Adapters**
If we use a Beste UI component, wrap it in our renderer:

```typescript
// src/blocks/hero/renderer.tsx
import React from 'react';
import { BestHeroComponent } from '@/vendor/beste-ui/hero';
import type { HeroBlockData } from '@/types/blocks';

export function renderHero(data: HeroBlockData): React.ReactNode {
  // Map our canonical data to Beste props
  return (
    <BestHeroComponent
      title={data.title}
      subtitle={data.subtitle}
      ctaText={data.primaryCtaText}
      ctaHref={data.primaryCtaHref}
      backgroundImage={data.backgroundImage}
    />
  );
}
```

The rest of the app only knows about `hero` block and `HeroBlockData`.

#### 4. **Vendor Components Placement**
Copied Beste UI components live in `src/vendor/beste-ui/` with minimal external dependencies.

Do NOT:
- Import Beste UI directly in renderers (use the vendor copy)
- Store Beste-specific prop names in our data model
- Expose Beste APIs to editors or the public renderer
- Use Beste as a direct dependency in store or page model

#### 5. **Integration Boundaries**

| Boundary | ✅ Allowed | ❌ Not Allowed |
|----------|-----------|----------------|
| Block registry | `type: 'hero'` | `type: 'beste-hero'` |
| Page JSON | `{ type: 'hero', data: { title: '...' } }` | Beste-specific props |
| Editor core | Our canonical data model | Beste-specific fields |
| Renderer | Wrap Beste UI internally | Direct Beste imports outside renderer |
| Store/AI/Pipeline | Our canonical types | Beste component types |

### Workflow: Adding a Beste-Backed Block

1. **Define canonical block type & data model** in `src/types/blocks.ts`
   ```typescript
   type FeatureBlockData = {
     title: string;
     description: string;
     imageUrl?: string;
     features: Array<{ icon?: string; title: string; description: string }>;
   };
   ```

2. **Copy relevant Beste UI component** to `src/vendor/beste-ui/feature.tsx`

3. **Create block folder** `src/blocks/feature/`

4. **Write renderer** that maps canonical data to Beste props:
   ```typescript
   // src/blocks/feature/renderer.tsx
   import { BesteFeatureComponent } from '@/vendor/beste-ui/feature';
   export function renderFeature(data: FeatureBlockData) {
     return <BesteFeatureComponent {...data} />;
   }
   ```

5. **Write editor** for canonical data model (not Beste-specific):
   ```typescript
   // src/blocks/feature/editor.tsx
   export function FeatureEditor({ data, onChange }) {
     return (
       <>
         <input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
         {/* Edit canonical fields, not Beste props */}
       </>
     );
   }
   ```

6. **Register block** with canonical type:
   ```typescript
   // src/blocks/registry.ts
   registerBlock('feature', {
     label: 'Feature',
     defaultData: { title: '', description: '', features: [] },
     renderer: renderFeature,
     editor: FeatureEditor,
   });
   ```

### Long-term Migration Path

If we later:
- Switch from Beste to another UI library → Only update vendor adapters and renderers
- Build our own component library → Replace vendor files with our components
- Add multiple UI sources → Add `src/vendor/shadcn/`, `src/vendor/our-components/`, etc.

The canonical block types, data model, and editor stay unchanged.

### Current Vendor Usage

- **Beste UI**: Used for hero, FAQ, CTA, and features blocks (temporarily)
- **shadcn/ui**: Used for form controls (maintained separately as npm dependency)
- **Custom**: Heading, paragraph, image (our own implementations)

### Related Files

- [Vendor README](src/vendor/beste-ui/README.md) — Component inventory and notes
- [Block Registry](src/blocks/registry.ts) — Block definitions
- [Block Types](src/types/blocks.ts) — Canonical data models
