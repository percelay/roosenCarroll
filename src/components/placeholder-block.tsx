import { ImageOff } from "lucide-react";

type PlaceholderBlockProps = {
  caption: string;
  tone?: "light" | "dark";
};

export function PlaceholderBlock({
  caption,
  tone = "light"
}: PlaceholderBlockProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={[
        "rounded-[1.5rem] border border-dashed p-6 transition-colors duration-200",
        isDark
          ? "border-panel/28 bg-panel/10 hover:border-panel/42 hover:bg-panel/12"
          : "surface-panel bg-panel/70 hover:border-brand/70 hover:bg-panel"
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "rounded-full p-3",
            isDark ? "bg-panel/14 text-panel" : "bg-brand/10 text-brand"
          ].join(" ")}
        >
          <ImageOff className="size-5" />
        </div>
        <p className={["text-sm leading-7", isDark ? "text-panel" : "text-ink"].join(" ")}>
          {caption}
        </p>
      </div>
    </div>
  );
}
