# Forge: Sovereign AI Workbench

Build a polished frontend prototype for my SIH project FORGE — Sovereign AI Workbench.

Product concept

FORGE is a private, self-hosted AI workbench for organizations handling sensitive industrial, PSU, government and defence-related information.

The core USP is:

FORGE doesn't just answer — it selects the right AI capability, performs multi-step work, verifies the result, and keeps the workflow controlled and auditable.

For this prototype, focus on the chatbot experience and USP demonstration. Use realistic mock data and interactions; do not build a real AI backend yet.

TECH STACK

Use:

React

TypeScript

Tailwind CSS

shadcn/ui

lucide-react

Vite if applicable

Keep components modular and easy to connect to a future FastAPI/local-AI backend.

MAIN PAGE

Create a full-screen dark chatbot interface inspired by the usability of ChatGPT and Claude, but with an original FORGE identity.

The application should look like a serious enterprise/government engineering AI product, not a generic AI startup landing page.

Layout

┌──────────────┬────────────────────────────────────┐
│              │ FORGE                              │
│   SIDEBAR    │                                    │
│              │ Conversation                       │
│   New Chat   │                                    │
│   Search     │                                    │
│   History    │                                    │
│              │                                    │
│              │                                    │
│              │                                    │
│              │                                    │
│              │                                    │
│              │         CHAT AREA                  │
│              │                                    │
│              │                                    │
│              │                                    │
│              │                                    │
│              │        ┌──────────────────┐        │
│              │        │ Message Composer │        │
│              │        └──────────────────┘        │
└──────────────┴────────────────────────────────────┘


FORGE BRANDING

Display:

FORGE

Subtitle:

Sovereign AI Workbench

Small tagline:

Private intelligence. Local execution. Full control.

Use a sophisticated dark visual system:

Near-black background

Dark gray surfaces

Thin borders

White/light typography

One restrained accent color

Subtle animations

Minimal gradients

Avoid excessive neon, gaming aesthetics, giant gradients, or unnecessary glassmorphism.

SIDEBAR

Include:

FORGE logo/header

Sovereign AI Workbench

Buttons

+ New Chat

Search

Recent conversations

Inspection Report Analysis

Pump Maintenance Review

Engineering Calculation

SOP Analysis

Bottom status

Show:

● Sovereign Mode

Local processing

External connections: 0

This is a prototype status indicator only. Do not claim real network isolation unless actually implemented.

CHAT HEADER

Display:

FORGE

Current selected model:

FORGE Document

On the right:

● Local

and a simple settings/menu icon.

DEMO CONVERSATION

Pre-populate the page with a realistic demonstration so it immediately looks functional.

User message

Analyze this inspection report and prepare an approval note based on the applicable SOP.

Show an attached file:

📄 inspection_report.pdf

MODEL ROUTER

Create a visible but compact model-routing component.

After the user sends the request, display:

TASK DETECTED

Document Analysis

REQUIRED CAPABILITIES

✓ PDF understanding
✓ OCR
✓ Reasoning
✓ Knowledge retrieval

MODEL SELECTED

FORGE Document

For a coding request, mock the router selecting:

FORGE Text

For an image request:

FORGE Vision

This demonstrates FORGE's automatic model-selection USP.

MODELS DROPDOWN

In the message composer, create a dropdown called:

Models

Options:

FORGE Text

Reasoning & text

FORGE Vision

Image understanding

FORGE Document

PDF & document analysis

Each option should have an appropriate lucide icon, short description and selected state.

The current model should be displayed inside the composer.

Make this reusable for future real models.

EFFORT DROPDOWN

Next to Models, create:

Effort

Options:

Low

Medium

High

Max

Use frontend state only for now.

MESSAGE COMPOSER

Create a large rounded composer at the bottom.

Placeholder:

Ask FORGE anything...

Include:

Attachment button

Options:

Image

PDF

Camera

Use lucide-react icons.

Selected files should appear as attachment chips/previews with a remove button.

Camera can open a mock camera/upload dialog for now.

BORDER BEAM

Install/use the border-beam package.

Create:

/components/ui/border-beam.tsx

using:

import { BorderBeam } from "border-beam";
import type {
  BorderBeamProps,
  BorderBeamSize,
  BorderBeamTheme,
  BorderBeamColorVariant,
} from "border-beam";

export type {
  BorderBeamProps,
  BorderBeamSize,
  BorderBeamTheme,
  BorderBeamColorVariant,
};

export { BorderBeam };
export default BorderBeam;


Install the dependency if required:

npm install border-beam


Wrap the main message composer with BorderBeam.

Keep the effect subtle and professional.

AI ACTIVITY SYSTEM

This is one of the most important parts of the prototype.

When FORGE processes a request, show an expandable Activity section that communicates what the agent is doing.

Do NOT show hidden chain-of-thought or private reasoning.

Only show concise action/status information.

Example:

FORGE is working...

✓ Reading inspection report
✓ Processing scanned pages
✓ Searching internal knowledge
✓ Finding applicable SOP
✓ Extracting findings
⟳ Verifying results
○ Preparing approval note


Animate the current step.

When complete:

✓ Task completed · 7 steps


Allow the Activity section to collapse.

AGENTIC WORKFLOW

The mock workflow should visually demonstrate:

User request
     ↓
Task classification
     ↓
Model selection
     ↓
Document processing
     ↓
Knowledge retrieval
     ↓
Analysis
     ↓
Verification
     ↓
Deliverable


This should feel like FORGE is doing work, rather than simply generating a chatbot response.

ASSISTANT RESPONSE

After the activity completes, show:

Key Findings

Finding 1

Finding 2

Finding 3

Internal Sources

Show source cards:

Inspection_Report.pdf · Page 4

Maintenance_SOP.pdf · Section 3.2

Each source should be visually distinguishable.

Verification

Show:

✓ Verified against internal sources

Then provide:

Generate Approval Note

When clicked:

Show a short loading state and then:

✓ Approval_Note.docx ready

with a Download button.

The download can be mocked for now.

AUDIT TRAIL

Add an expandable audit panel.

Example:

13:41:02   Task received
13:41:03   Model selected: FORGE Document
13:41:05   Document processed
13:41:08   Internal knowledge searched
13:41:11   Findings verified
13:41:14   Approval note generated


Use timestamps and small status icons.

The purpose is to demonstrate:

Everything the AI does is traceable.

SECURITY / SOVEREIGNTY PANEL

Add a subtle expandable security indicator.

Show:

SOVEREIGN MODE

✓ Local model
✓ Local knowledge base
✓ Local file processing
✓ Controlled tool access

External connections
0


Do not pretend these are real network measurements unless implemented.

INTERACTIONS

Implement actual frontend state for:

Sending messages

Adding/removing attachments

Selecting models

Selecting effort

Opening/collapsing Activity

Opening/collapsing Audit Trail

Mock task processing

Progressing through activity steps

Generating the mock approval note

Sidebar conversation selection

New Chat

When Send is clicked:

Add user message.

Show attachment if present.

Show model-routing result.

Start Activity.

Progress through several steps.

Show final assistant response.

Show sources.

Show verification.

Enable approval-note generation.

RESPONSIVE DESIGN

Desktop should be the primary target.

Also support:

Tablet

Mobile

On mobile:

Sidebar collapses.

Composer controls remain usable.

Models/Effort selectors do not overflow.

Activity becomes a compact expandable component.

COMPONENT STRUCTURE

Keep the project modular.

Suggested structure:

src/
  components/
    ui/
      border-beam.tsx
    chat/
      ChatInterface.tsx
      ChatMessage.tsx
      ChatComposer.tsx
      ModelSelector.tsx
      EffortSelector.tsx
      AttachmentMenu.tsx
      ActivityPanel.tsx
      ModelRouter.tsx
      AuditTrail.tsx
      SourceCard.tsx
      ApprovalNote.tsx
    layout/
      Sidebar.tsx
      Header.tsx


Adapt this to the existing project structure if necessary.

IMPORTANT

This is a prototype for SIH internal selection.

Do not spend time building:

Real LLM infrastructure

Kubernetes

Authentication

Multi-GPU systems

Production databases

Complex backend services

Dozens of AI models

Use mock data where necessary.

The prototype's purpose is to communicate one powerful idea:

FORGE is not an offline chatbot. It is a controlled sovereign AI workbench that chooses the right model, performs multi-step work, uses organizational knowledge, verifies its output, generates real deliverables, and maintains an audit trail.

FINAL REQUIREMENT

After implementing everything:

Run the application.

Fix all TypeScript/build errors.

Verify every interaction works.

Verify BorderBeam renders correctly.

Check responsive behavior.

Remove unnecessary placeholder content.

Make the final UI presentation-ready.

Prioritize polish, clarity and demonstration of the FORGE USP over adding more features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/276abdb3-d6d5-4f9e-803b-dbf336e1a1f7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
