import { ImageOff } from "lucide-react";

type PlaceholderBlockProps = {
  caption: string;
};

export function PlaceholderBlock({ caption }: PlaceholderBlockProps) {
  return (
    <div className="surface-panel border-dashed bg-panel/70 p-6 transition-colors duration-200 hover:border-brand/70 hover:bg-panel">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-brand/10 p-3 text-brand">
          <ImageOff className="size-5" />
        </div>
        <p className="text-sm leading-7 text-ink">{caption}</p>
      </div>
    </div>
  );
}
