# Beste UI Vendor Components

This directory contains **copied and adapted** Beste UI components.

## Purpose

We use Beste UI components as a temporary UI source while maintaining **architectural independence**. The rest of the app uses our canonical block types and data models, not Beste-specific APIs.

## Current Components

| Component | Purpose | Source | Status |
|-----------|---------|--------|--------|
| (To be added) | Hero section | Beste UI | Placeholder |
| (To be added) | FAQ accordion | Beste UI | Placeholder |
| (To be added) | CTA block | Beste UI | Placeholder |

_As components are copied from Beste UI, update this table._

## Rules for Vendor Components

1. **Minimal dependencies**: Keep vendor components self-contained. Avoid importing from other vendor dirs.

2. **Copy, don't link**: Components are **copied** into this directory, not imported as npm packages. This ensures we control versions and can modify if needed.

3. **Preserve original structure**: Copy the component's React code, styles, and icons as-is. Include attribution if needed.

4. **Mark as vendor**: Add a comment at the top of each file:
   ```typescript
   // @vendor: Beste UI
   // Source: https://github.com/besteui/components
   // Copied and adapted for use in this project
   ```

5. **Do not re-export**: Vendor components are only imported inside block renderers (`src/blocks/*/renderer.tsx`), not exposed to the rest of the app.

6. **No modifications to page model**: Never expose vendor-specific props or types in `src/types/blocks.ts`.

## Adding a New Beste Component

1. Locate the component in Beste UI source (e.g., `components/hero/hero.tsx`)
2. Copy the component file and any dependencies (utils, icons, styles) into this directory
3. Update imports within the component to use relative paths or `@/vendor/beste-ui/`
4. Create a block renderer in `src/blocks/[type]/renderer.tsx` that wraps the vendor component
5. Map your canonical block data to vendor component props inside the renderer
6. Update the table above

## Example: Wrapping a Beste Component

**Vendor component** (`src/vendor/beste-ui/hero.tsx`):
```typescript
// @vendor: Beste UI
export function BesteHero({ title, subtitle, backgroundImage, cta }) {
  return (
    <div style={{ backgroundImage }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button>{cta.text}</button>
    </div>
  );
}
```

**Block renderer** (`src/blocks/hero/renderer.tsx`):
```typescript
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
    />
  );
}
```

The app only knows about `HeroBlockData` and the `hero` block type. The Beste component is an implementation detail.

## Migration Strategy

If we decide to:
- **Replace Beste with another library**: Delete vendor files, update block renderers only
- **Build our own components**: Gradually replace vendor files with our own React components
- **Use multiple UI libraries**: Create parallel vendor directories (e.g., `src/vendor/shadcn/`, `src/vendor/our-ui/`)

The canonical block types and editors remain unchanged.

## License & Attribution

When copying components from Beste UI or other sources, ensure:
- Compliance with original license
- Clear attribution in file headers
- Legal review if needed for production use

## Related Documentation

- [Main ARCHITECTURE.md](../ARCHITECTURE.md) — Vendor pattern explanation
- [Block Registry](../blocks/registry.ts) — How blocks are registered
- [Block Types](../types/blocks.ts) — Canonical data models
