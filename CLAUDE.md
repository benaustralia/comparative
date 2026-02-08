# High-Density Conciseness & Deployment Audit (Feb 2026 Standards)

## Core Directive
Refactor the codebase for extreme conciseness without sacrificing legibility or breaking the CI/CD pipeline. Follow "Locality of Behavior" principles: keep logic close to the UI.

## Constraints & Anti-Patterns
- **File Length:** Target < 60 lines per file. If a file exceeds this, justify every line.
- **No Code Splitting:** Do not move logic into new files to meet line counts. Merge and simplify instead.
- **No Horizontal Stacking:** Avoid unreadable one-liners. Maintain vertical scannability.
- **No Single-Use Hooks:** Inline logic into the component unless shared across 3+ domains.
- **No Over-Engineering:** Remove unnecessary wrappers, complex state managers, and "abstraction for the sake of abstraction."

## Technical Guardrails (Deployment Sync)
- **CI/CD Alignment:** Any change to `package.json` scripts MUST be mirrored in `.github/workflows/firebase-hosting-merge.yml`.
- **Build Output:** The `public` directory in `firebase.json` must exactly match the output folder of the `npm run build` command. Do not rename build directories without updating both files.
- **Metadata Automation:** In the project creation flow, automate 'Year' and 'Form' as background metadata. Remove these from the visible UI.

## Coding Style (2026 February Standards)
- **Declarative Density:** Use modern ECMAScript (signals, native pattern matching) to collapse boilerplate.
- **Predictive UX:** Use the `VCE_LIBRARY_2026` for ghost-text typeahead. 
- **Typography:** UI/Inputs in 'Inter'; Final Titles/Nodes in 'Serif'.