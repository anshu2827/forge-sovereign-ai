import { useState } from "react";
import { Camera, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Attachment, AttachmentKind } from "@/lib/forge";

const SAMPLES: Record<AttachmentKind, { name: string; size: string }> = {
  pdf: { name: "inspection_report.pdf", size: "2.4 MB" },
  image: { name: "flange_corrosion.jpg", size: "1.1 MB" },
  camera: { name: "capture_field.jpg", size: "820 KB" },
};

export function AttachmentMenu({
  onAdd,
}: {
  onAdd: (a: Attachment) => void;
}) {
  const [cameraOpen, setCameraOpen] = useState(false);

  const add = (kind: AttachmentKind) => {
    const s = SAMPLES[kind];
    onAdd({
      id: `${kind}-${Date.now()}`,
      name: s.name,
      kind,
      size: s.size,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            aria-label="Add attachment"
          >
            <Paperclip className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onSelect={() => add("image")} className="gap-2">
            <ImageIcon className="size-4 text-muted-foreground" /> Image
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => add("pdf")} className="gap-2">
            <FileText className="size-4 text-muted-foreground" /> PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setCameraOpen(true)}
            className="gap-2"
          >
            <Camera className="size-4 text-muted-foreground" /> Camera
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capture field evidence</DialogTitle>
            <DialogDescription>
              Camera capture is mocked in this prototype. Frames are processed
              locally and never leave the workstation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid aspect-video place-items-center rounded-lg border border-border bg-surface forge-grid">
            <Camera className="size-8 text-muted-foreground" />
          </div>
          <DialogFooter>
            <button
              onClick={() => setCameraOpen(false)}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                add("camera");
                setCameraOpen(false);
              }}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Capture frame
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
