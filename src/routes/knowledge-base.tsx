import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { setWorkbenchContext } from "@/lib/workbench-context";
import {
  BookOpen,
  Search,
  MessageSquare,
  Shield,
  FileText,
  Settings2,
  Wrench,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({ meta: [{ title: "Knowledge Base — FORGE" }] }),
  component: KnowledgeBaseRoute,
});

type KBCategory = "SOP" | "Manual" | "Engineering" | "Policy" | "Safety";

interface KBArticle {
  id: string;
  title: string;
  category: KBCategory;
  excerpt: string;
  date: string;
  relevance: number;
  docRef: string;
}

const KB_ARTICLES: KBArticle[] = [
  { id: "k1", title: "Pump Maintenance SOP — Vibration & Bearing Inspection", category: "SOP", excerpt: "Defines the vibration thresholds, inspection cycles, and approval requirements for centrifugal pump maintenance.", date: "2026-07-15", relevance: 98, docRef: "Maintenance_SOP.pdf · Section 3.2" },
  { id: "k2", title: "Piping System Pressure Testing Protocol", category: "SOP", excerpt: "Outlines hydrostatic and pneumatic testing requirements for piping systems above 10 bar design pressure.", date: "2026-06-20", relevance: 87, docRef: "Piping_SOP.pdf · Section 7.1" },
  { id: "k3", title: "Flange Corrosion Assessment — Visual Inspection Guide", category: "Manual", excerpt: "Criteria for visual corrosion assessment of flanged joints, with reference photographic examples and severity classifications.", date: "2026-05-10", relevance: 92, docRef: "Inspection_Manual.pdf · Chapter 4" },
  { id: "k4", title: "Engineering Calculation Standards — Pipe Wall Thickness", category: "Engineering", excerpt: "ASME B31.3 based calculation methodology for pressure pipe wall thickness including corrosion allowance requirements.", date: "2026-04-22", relevance: 79, docRef: "Piping_Design_Spec.pdf · Table 4" },
  { id: "k5", title: "Data Privacy & AI Tool Usage Policy", category: "Policy", excerpt: "Governs the use of AI tools for processing organizational data. Mandates on-premises deployment for confidential documents.", date: "2026-03-01", relevance: 65, docRef: "AI_Policy.pdf · Section 2" },
  { id: "k6", title: "Emergency Shutdown Procedures — Pump Station", category: "Safety", excerpt: "Step-by-step ESD procedure for pump station including isolation valve sequence and post-shutdown inspection requirements.", date: "2026-08-01", relevance: 74, docRef: "Safety_Procedures.pdf · Chapter 3" },
  { id: "k7", title: "Lubrication Schedule & Record Keeping", category: "Manual", excerpt: "Mandatory greasing and oil change intervals for rotating equipment with record-keeping requirements before approval.", date: "2026-07-01", relevance: 83, docRef: "Maintenance_SOP.pdf · Section 5.4" },
  { id: "k8", title: "Approval Note Standards & Sign-Off Authority", category: "Policy", excerpt: "Defines who can issue approval notes for different equipment classes and what information must be included.", date: "2026-02-14", relevance: 70, docRef: "Approval_Policy.pdf · Section 1" },
];

const CATEGORY_ICONS: Record<KBCategory, React.ElementType> = {
  SOP: FileText,
  Manual: BookOpen,
  Engineering: Settings2,
  Policy: Shield,
  Safety: AlertTriangle,
};

const CATEGORY_COLORS: Record<KBCategory, string> = {
  SOP: "text-primary border-primary/20 bg-primary/10",
  Manual: "text-info border-info/20 bg-info/10",
  Engineering: "text-success border-success/20 bg-success/10",
  Policy: "text-muted-foreground border-border bg-surface",
  Safety: "text-destructive border-destructive/20 bg-destructive/10",
};

function KnowledgeBaseRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/signin" });
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <KBPage />
    </AppShell>
  );
}

function KBPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<KBCategory | "all">("all");

  const filtered = KB_ARTICLES.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchSearch && matchCat;
  }).sort((a, b) => b.relevance - a.relevance);

  const handleAsk = (article: KBArticle) => {
    setWorkbenchContext({
      prefillText: `Tell me about: ${article.title}. Reference: ${article.docRef}`,
      source: "knowledge-base",
    });
    navigate({ to: "/chat" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Knowledge Base</h1>
        <p className="mt-1 text-sm text-muted-foreground">SOPs, manuals, engineering standards, and policies for your organization.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 flex-1 min-w-[200px]">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge base..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "SOP", "Manual", "Engineering", "Policy", "Safety"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                categoryFilter === cat
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} articles</p>

      {/* Articles Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((article) => {
          const CatIcon = CATEGORY_ICONS[article.category];
          const catColor = CATEGORY_COLORS[article.category];
          return (
            <div key={article.id} className="group rounded-xl border border-border bg-card/70 p-5 space-y-3 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium shrink-0 ${catColor}`}>
                  <CatIcon className="size-3" />
                  {article.category}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Wrench className="size-3" />
                  {article.relevance}% relevance
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-foreground leading-snug">{article.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">{article.excerpt}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] font-mono text-muted-foreground/80">{article.docRef}</p>
                <button
                  onClick={() => handleAsk(article)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-[12px] font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/20"
                >
                  <MessageSquare className="size-3.5" />
                  Ask FORGE
                  <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <BookOpen className="mx-auto size-10 mb-3 opacity-40" />
          <p className="text-sm">No articles match your search.</p>
        </div>
      )}
    </div>
  );
}
