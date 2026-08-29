/**
 * Lightweight cross-page context store.
 * Used to pass document / knowledge-base context from other pages into the AI Workbench.
 * Intentionally a plain module-level object (no React context needed — navigation triggers a re-render anyway).
 */

export interface WorkbenchContext {
  /** Pre-filled message text to send */
  prefillText?: string;
  /** Pre-attached document name */
  attachmentName?: string;
  /** Kind of attachment */
  attachmentKind?: "pdf" | "image";
  /** Source page that triggered navigation */
  source?: "documents" | "knowledge-base";
}

let _context: WorkbenchContext | null = null;

export function setWorkbenchContext(ctx: WorkbenchContext) {
  _context = ctx;
}

export function consumeWorkbenchContext(): WorkbenchContext | null {
  const ctx = _context;
  _context = null;
  return ctx;
}
