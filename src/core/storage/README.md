# Storage Adapters

The public storage API lives in `src/core/storage/documentStorage.ts`.
It currently delegates to a `localStorage` adapter and is intentionally shaped
so the app can move to a different persistence layer later without changing
feature-level imports.

## Future static JSON shape

This is documentation only for a future storage adapter. Filesystem storage is
not implemented in this step.

Path example:

`content/blog/my-first-post.json`

```json
{
  "id": "my-first-post",
  "module": "blog",
  "contentType": "blogPost",
  "title": "عنوان پست",
  "slug": "my-first-post",
  "excerpt": "خلاصه کوتاه",
  "status": "published",
  "publishedAt": "2026-06-03",
  "updatedAt": "2026-06-03",
  "blocks": []
}
```
