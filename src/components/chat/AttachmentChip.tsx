import { Camera, FileText, Image as ImageIcon, X } from "lucide-react";
import type { Attachment } from "@/lib/forge";

const ICONS = { pdf: FileText, image: ImageIcon, camera: Camera };

export function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment;
  onRemove?: (id: string) => void;
}) {
  const Icon = ICONS[attachment.kind];
  return (
    <span className="flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span className="truncate text-foreground/90">{attachment.name}</span>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
        {attachment.size}
      </span>
      {onRemove && (
        <button
          onClick={() => onRemove(attachment.id)}
          className="grid size-4 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Remove ${attachment.name}`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
