"use client";

type BlogEditorHeaderProps = {
  title: string;
  excerpt?: string;
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
};

export default function BlogEditorHeader({
  title,
  excerpt,
  onTitleChange,
  onExcerptChange,
}: BlogEditorHeaderProps) {
  return (
    <header className="mb-8 space-y-3">
      <input
        value={title}
        onChange={(event) => {
          onTitleChange(event.target.value);
        }}
        placeholder="عنوان پست"
        className="w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-4xl font-bold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
      />

      <textarea
        value={excerpt ?? ""}
        rows={2}
        onChange={(event) => {
          onExcerptChange(event.target.value);
        }}
        placeholder="متن توضیحی کوتاه برای این پست..."
        className="w-full resize-none rounded-md border border-transparent bg-transparent px-3 py-2 text-lg leading-8 text-muted-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
      />
    </header>
  );
}
