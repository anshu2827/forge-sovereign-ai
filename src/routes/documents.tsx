import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { setWorkbenchContext } from "@/lib/workbench-context";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  ArrowRight,
  FileSpreadsheet,
  File,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — FORGE" }] }),
  component: DocumentsRoute,
});

type DocStatus = "Processed" | "Processing" | "Pending";
type DocType = "pdf" | "docx" | "xlsx" | "image";

interface Doc {
  id: string;
  name: string;
  type: DocType;
  size: string;
  status: DocStatus;
  date: string;
  pages?: number;
}

const MOCK_DOCS: Doc[] = [
  { id: "d1", name: "Pump_Inspection_Report_PMP402.pdf", type: "pdf", size: "2.4 MB", status: "Processed", date: "2026-08-29", pages: 18 },
  { id: "d2", name: "Maintenance_SOP_Rev4.pdf", type: "pdf", size: "1.1 MB", status: "Processed", date: "2026-08-28", pages: 34 },
  { id: "d3", name: "Field_Photo_Log_Q3.pdf", type: "pdf", size: "8.7 MB", status: "Processed", date: "2026-08-27", pages: 52 },
  { id: "d4", name: "Valve_Inspection_Q3.pdf", type: "pdf", size: "3.2 MB", status: "Processing", date: "2026-08-29", pages: 12 },
  { id: "d5", name: "Engineering_Calculations.xlsx", type: "xlsx", size: "0.9 MB", status: "Processed", date: "2026-08-26" },
  { id: "d6", name: "Safety_Procedures_Manual.docx", type: "docx", size: "1.8 MB", status: "Processed", date: "2026-08-25" },
  { id: "d7", name: "Flange_Inspection_Photo_07.jpg", type: "image", size: "4.1 MB", status: "Processed", date: "2026-08-24" },
  { id: "d8", name: "Asset_Register_FY26.xlsx", type: "xlsx", size: "2.3 MB", status: "Pending", date: "2026-08-29" },
];

const TYPE_ICONS: Record<DocType, React.ElementType> = {
  pdf: FileText,
  docx: File,
  xlsx: FileSpreadsheet,
  image: ImageIcon,
};

const TYPE_COLORS: Record<DocType, string> = {
  pdf: "text-destructive border-destructive/20 bg-destructive/10",
  docx: "text-info border-info/20 bg-info/10",
  xlsx: "text-success border-success/20 bg-success/10",
  image: "text-primary border-primary/20 bg-primary/10",
};

const STATUS_CONFIG: Record<DocStatus, { icon: React.ElementType; color: string; label: string }> = {
  Processed: { icon: CheckCircle2, color: "text-success", label: "Processed" },
  Processing: { icon: Loader2, color: "text-info", label: "Processing" },
  Pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
};

function DocumentsRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/signin" });
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <DocumentsPage />
    </AppShell>
  );
}

function DocumentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocStatus | "all">("all");
  const [uploadToast, setUploadToast] = useState(false);

  const filtered = MOCK_DOCS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || d.type === typeFilter;
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleAnalyze = (doc: Doc) => {
    setWorkbenchContext({
      prefillText: `Analyze ${doc.name} and provide a detailed summary with key findings.`,
      attachmentName: doc.name,
      attachmentKind: doc.type === "image" ? "image" : "pdf",
      source: "documents",
    });
    navigate({ to: "/chat" });
  };

  const handleUpload = () => {
    setUploadToast(true);
    setTimeout(() => setUploadToast(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload and manage your organization's documents for AI analysis.</p>
        </div>
        <button
          onClick={handleUpload}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="size-4" />
          Upload Document
        </button>
      </div>

      {uploadToast && (
        <div className="animate-fade-up rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          ✓ Upload dialog would open here. (Mock prototype)
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 flex-1 min-w-[200px]">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocType | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          >
            <option value="all">All types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
            <option value="image">Image</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocStatus | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          >
            <option value="all">All status</option>
            <option value="Processed">Processed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filtered.length} document{filtered.length !== 1 ? "s" : ""}</span>
        <span>·</span>
        <span>{MOCK_DOCS.filter(d => d.status === "Processed").length} processed</span>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface/50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Size</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Status</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((doc) => {
              const TypeIcon = TYPE_ICONS[doc.type];
              const typeColor = TYPE_COLORS[doc.type];
              const statusCfg = STATUS_CONFIG[doc.status];
              const StatusIcon = statusCfg.icon;
              return (
                <tr key={doc.id} className="transition-colors hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid size-8 shrink-0 place-items-center rounded-lg border ${typeColor}`}>
                        <TypeIcon className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground max-w-[200px] sm:max-w-[300px]">{doc.name}</p>
                        {doc.pages && <p className="text-[11px] text-muted-foreground">{doc.pages} pages</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-[12px] text-muted-foreground sm:table-cell">{doc.size}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${statusCfg.color}`}>
                      <StatusIcon className={`size-3.5 ${doc.status === "Processing" ? "animate-spin" : ""}`} />
                      {statusCfg.label}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-[12px] text-muted-foreground lg:table-cell">{doc.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground" title="Preview">
                        <Eye className="size-3.5" />
                      </button>
                      <button className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground" title="Download">
                        <Download className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleAnalyze(doc)}
                        disabled={doc.status !== "Processed"}
                        className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Analyze with FORGE AI Workbench"
                      >
                        Analyze with FORGE
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <FileText className="mx-auto size-8 mb-3 opacity-40" />
            <p className="text-sm">No documents match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
