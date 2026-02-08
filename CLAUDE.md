# Collaborative Mapping Project: Desktop Workspace

## 1. System Guardrails (Strict Enforcement)
- **Architecture:** Clerk + Firebase (Sydney region).
- **Auth SSOT:** Use Firebase UID (`ownerId`) for all permissions. 
- **Owner UID:** `FgH8dLkSiHbYwF78PkCHmZvP3M12`.
- **UI System:** Strictly **shadcn/ui** primitives only.
- **No Experimentation:** - NO SVG filters, jitter, or Rough.js.
    - NO mobile-responsive drawers; use desktop-only viewport.
    - NO custom Tailwind "utility soup" in main views.

## 2. Desktop Layout & Dashboard
- **Viewport:** `h-screen w-screen overflow-hidden`.
- **Panels:** Use shadcn `ResizablePanelGroup`.
    - **Sidebar (Left):** Dashboard for creating/switching projects.
    - **Canvas (Main):** React Flow mapping area.
- **Project Creation:** Dialog must require "Title" and "Form" (e.g., Play, Novel) for both Text A and Text B.
- **Project Name:** Automatically generate as `[Title A] vs. [Title B]`.

## 3. Mapping Functionality
- **Cantilever (Bridge):** A bridge contains: Context, Evidence, Meaning A/B, and Synthesis.
- **Map View:** Display every data point in discrete, stable boxes connected by clean arrows.
- **Bridge Removal:** Add a Lucide `Trash2` icon to each bridge group to delete that cantilever.
- **Sharing:** Re-implement "Share" button to add emails to `editors` and `viewers` Firestore arrays.

## 4. Components & Typography
- **UI:** Inter (Sans-serif).
- **Text:** High-legibility Serif for literature.
- **Atomic Components:** Extract logic into `ProjectSidebar`, `BridgeNode`, and `ShareModal`.