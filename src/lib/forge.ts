import {
  FileText,
  Image as ImageIcon,
  Type,
  type LucideIcon,
} from "lucide-react";

export type ModelId = "forge-text" | "forge-vision" | "forge-document";

export interface ForgeModel {
  id: ModelId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const FORGE_MODELS: ForgeModel[] = [
  {
    id: "forge-text",
    name: "FORGE Text",
    description: "Reasoning & text",
    icon: Type,
  },
  {
    id: "forge-vision",
    name: "FORGE Vision",
    description: "Image understanding",
    icon: ImageIcon,
  },
  {
    id: "forge-document",
    name: "FORGE Document",
    description: "PDF & document analysis",
    icon: FileText,
  },
];

export const getModel = (id: ModelId): ForgeModel =>
  FORGE_MODELS.find((m) => m.id === id) ?? FORGE_MODELS[2]!;

export type EffortLevel = "Low" | "Medium" | "High" | "Max";
export const EFFORT_LEVELS: EffortLevel[] = ["Low", "Medium", "High", "Max"];

export type AttachmentKind = "pdf" | "image" | "camera";

export interface Attachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  size: string;
}

export interface RoutingResult {
  task: string;
  capabilities: string[];
  model: ModelId;
}

export type ActivityStatus = "done" | "active" | "pending";

export interface ActivityStep {
  label: string;
  status: ActivityStatus;
}

export interface SourceRef {
  file: string;
  locator: string;
  kind: "report" | "sop";
  excerpt: string;
}

export interface AssistantAnswer {
  summary: string;
  findings: { title: string; detail: string; severity: string }[];
  sources: SourceRef[];
  verification: string;
  deliverable?: { label: string; fileName: string } | undefined;
}

export interface AuditEntry {
  time: string;
  event: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[] | undefined;
  routing?: RoutingResult | undefined;
  steps?: ActivityStep[] | undefined;
  activityDone?: boolean | undefined;
  answer?: AssistantAnswer | undefined;
  audit?: AuditEntry[] | undefined;
  effort?: EffortLevel | undefined;
}

export interface Conversation {
  id: string;
  title: string;
  meta: string;
  messages: ChatMessageData[];
}

/* --------------------------- mock routing logic --------------------------- */

export function classifyRequest(
  text: string,
  attachments: Attachment[],
): RoutingResult {
  const t = text.toLowerCase();
  const hasImage = attachments.some(
    (a) => a.kind === "image" || a.kind === "camera",
  );
  const hasDoc = attachments.some((a) => a.kind === "pdf");

  if (
    hasImage ||
    /image|photo|picture|diagram|drawing|corrosion|visual/.test(t)
  ) {
    return {
      task: "Visual Inspection",
      capabilities: [
        "Image understanding",
        "Defect detection",
        "Reasoning",
        "Knowledge retrieval",
      ],
      model: "forge-vision",
    };
  }
  if (
    /code|script|python|sql|function|regex|program|refactor|calculat/.test(t)
  ) {
    return {
      task: "Code & Computation",
      capabilities: ["Code synthesis", "Reasoning", "Unit verification"],
      model: "forge-text",
    };
  }
  if (hasDoc || /report|sop|pdf|document|approval|policy|clause/.test(t)) {
    return {
      task: "Document Analysis",
      capabilities: [
        "PDF understanding",
        "OCR",
        "Reasoning",
        "Knowledge retrieval",
      ],
      model: "forge-document",
    };
  }
  return {
    task: "General Reasoning",
    capabilities: ["Reasoning", "Knowledge retrieval"],
    model: "forge-text",
  };
}

export function stepsForTask(task: string): string[] {
  switch (task) {
    case "Document Analysis":
      return [
        "Reading inspection report",
        "Processing scanned pages",
        "Searching internal knowledge",
        "Finding applicable SOP",
        "Extracting findings",
        "Verifying results",
        "Preparing approval note",
      ];
    case "Visual Inspection":
      return [
        "Loading image asset",
        "Running local vision model",
        "Detecting anomalies",
        "Searching internal knowledge",
        "Cross-checking with SOP",
        "Verifying results",
        "Preparing summary",
      ];
    case "Code & Computation":
      return [
        "Parsing request",
        "Retrieving engineering standards",
        "Drafting computation",
        "Running local sandbox check",
        "Verifying results",
        "Preparing deliverable",
      ];
    default:
      return [
        "Parsing request",
        "Searching internal knowledge",
        "Composing response",
        "Verifying results",
      ];
  }
}

export function answerForTask(task: string): AssistantAnswer {
  if (task === "Visual Inspection") {
    return {
      summary:
        "Visual analysis complete. Two conditions were matched against the maintenance SOP thresholds.",
      findings: [
        {
          title: "Surface corrosion on flange assembly",
          detail:
            "Estimated coverage 12% of the visible flange face — above the 8% advisory limit in SOP 3.2.",
          severity: "Major",
        },
        {
          title: "Gasket seating misalignment",
          detail:
            "Offset visible on the lower-left bolt pair; re-torque sequence recommended before recommissioning.",
          severity: "Minor",
        },
        {
          title: "Tag plate legible and matched",
          detail:
            "Asset tag PMP-402 matches the maintenance register entry with no discrepancy.",
          severity: "Info",
        },
      ],
      sources: [
        {
          file: "Field_Photo_Log.pdf",
          locator: "Frame 12",
          kind: "report",
          excerpt: "Flange face, west pump house, captured 08:14.",
        },
        {
          file: "Maintenance_SOP.pdf",
          locator: "Section 3.2",
          kind: "sop",
          excerpt: "Corrosion coverage above 8% requires supervisor sign-off.",
        },
      ],
      verification: "Verified against internal sources",
      deliverable: { label: "Generate Inspection Note", fileName: "Inspection_Note.docx" },
    };
  }
  if (task === "Code & Computation") {
    return {
      summary:
        "Computation drafted and re-checked locally against the referenced design standard.",
      findings: [
        {
          title: "Required wall thickness: 7.42 mm",
          detail:
            "Computed for 12 bar design pressure, 300 mm ID, SA-106 Gr.B at 120 °C.",
          severity: "Result",
        },
        {
          title: "Corrosion allowance applied: 1.5 mm",
          detail: "Per internal piping specification for carbon steel service.",
          severity: "Assumption",
        },
        {
          title: "Selected schedule: SCH 40 (8.38 mm)",
          detail: "Nearest commercially available schedule above requirement.",
          severity: "Recommendation",
        },
      ],
      sources: [
        {
          file: "Piping_Design_Spec.pdf",
          locator: "Table 4",
          kind: "sop",
          excerpt: "Allowable stress values for SA-106 Gr.B up to 150 °C.",
        },
        {
          file: "Engineering_SOP.pdf",
          locator: "Section 6.1",
          kind: "sop",
          excerpt: "Corrosion allowance of 1.5 mm mandatory for CS piping.",
        },
      ],
      verification: "Verified against internal sources",
      deliverable: { label: "Generate Calculation Sheet", fileName: "Calculation_Sheet.docx" },
    };
  }
  return {
    summary:
      "The inspection report has been analysed and mapped to the applicable maintenance SOP.",
    findings: [
      {
        title: "Pump PMP-402 vibration exceeds advisory limit",
        detail:
          "Measured 7.8 mm/s RMS against the 4.5 mm/s advisory threshold defined in SOP 3.2.",
        severity: "Major",
      },
      {
        title: "Bearing temperature trending upward",
        detail:
          "Drive-end bearing rose 11 °C over three consecutive inspection cycles.",
        severity: "Moderate",
      },
      {
        title: "Lubrication record incomplete for Q2",
        detail:
          "Two scheduled greasing entries are missing; SOP requires closure before approval.",
        severity: "Administrative",
      },
    ],
    sources: [
      {
        file: "Inspection_Report.pdf",
        locator: "Page 4",
        kind: "report",
        excerpt:
          "Vibration survey: DE 7.8 mm/s RMS, NDE 5.1 mm/s RMS at rated speed.",
      },
      {
        file: "Maintenance_SOP.pdf",
        locator: "Section 3.2",
        kind: "sop",
        excerpt:
          "Readings above 4.5 mm/s RMS require corrective action and approval note.",
      },
    ],
    verification: "Verified against internal sources",
    deliverable: { label: "Generate Approval Note", fileName: "Approval_Note.docx" },
  };
}

export function buildAudit(modelName: string, task: string): AuditEntry[] {
  const base = new Date();
  const t = (offset: number) =>
    new Date(base.getTime() + offset * 1000).toLocaleTimeString("en-GB", {
      hour12: false,
    });
  return [
    { time: t(0), event: "Task received" },
    { time: t(1), event: `Task classified: ${task}` },
    { time: t(3), event: `Model selected: ${modelName}` },
    { time: t(5), event: "Document processed locally" },
    { time: t(8), event: "Internal knowledge searched" },
    { time: t(11), event: "Findings verified" },
    { time: t(14), event: "Deliverable prepared" },
  ];
}

/* ------------------------------ demo content ------------------------------ */

const demoRouting: RoutingResult = {
  task: "Document Analysis",
  capabilities: [
    "PDF understanding",
    "OCR",
    "Reasoning",
    "Knowledge retrieval",
  ],
  model: "forge-document",
};

export const DEMO_MESSAGES: ChatMessageData[] = [
  {
    id: "demo-user",
    role: "user",
    content:
      "Analyze this inspection report and prepare an approval note based on the applicable SOP.",
    attachments: [
      { id: "a1", name: "inspection_report.pdf", kind: "pdf", size: "2.4 MB" },
    ],
  },
  {
    id: "demo-assistant",
    role: "assistant",
    content: "",
    routing: demoRouting,
    effort: "High",
    steps: stepsForTask("Document Analysis").map((label) => ({
      label,
      status: "done" as ActivityStatus,
    })),
    activityDone: true,
    answer: answerForTask("Document Analysis"),
    audit: [
      { time: "13:41:02", event: "Task received" },
      { time: "13:41:03", event: "Model selected: FORGE Document" },
      { time: "13:41:05", event: "Document processed" },
      { time: "13:41:08", event: "Internal knowledge searched" },
      { time: "13:41:11", event: "Findings verified" },
      { time: "13:41:14", event: "Approval note generated" },
    ],
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Inspection Report Analysis",
    meta: "Today · FORGE Document",
    messages: DEMO_MESSAGES,
  },
  {
    id: "c2",
    title: "Pump Maintenance Review",
    meta: "Yesterday · FORGE Document",
    messages: [],
  },
  {
    id: "c3",
    title: "Engineering Calculation",
    meta: "2 days ago · FORGE Text",
    messages: [],
  },
  {
    id: "c4",
    title: "SOP Analysis",
    meta: "Last week · FORGE Document",
    messages: [],
  },
];
