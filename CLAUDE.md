Claude, I am providing an updated architectural vision for our application, transitioning it from a bridge-mapping tool to a comprehensive VCE Literature Essay Engine.

Please produce a detailed and reasoned plan for the following implementation:

1. Data & State Refactoring:

Initialize the knowledgeLibrary using the provided VCE hierarchies (Form > Convention > Generic Convention > Feature > Effect > Lens).

Perform a global rename of the tech property to feature.

Update the Essay state object to support a modular structure: one Foundation (Intro), up to four Cantilevers (Body Paragraphs), and one Keystone (Conclusion).

2. Sidebar & Navigation Overhaul:

Implement the status-check UI in the sidebar where each essay segment (Intro, Body P1-4, Conclusion) has a 'Draft' and 'Final' state toggle.

The sidebar should display the actual essay question or a short identifier (e.g., 'Macbeth & Power').

3. The 'Cantilever' (Body Paragraph) Zoom Logic:

Develop a strategy for the mind map to allow for 'Exploded Views.' When a student selects or zooms into a 'Cantilever' node, it should reveal a nested T-EE-EE-EE-L (Topic, Evidence, Explanation, Link) sub-structure.

This sub-structure must allow for direct text editing, modeling, and 'Mentor Me' interactions.

4. Context-Aware Input Overhaul:

Refactor the input forms to move away from free-text and toward selection-based inputs.

Once a user selects a Form (e.g., Film), the Feature dropdown must dynamically filter to show only relevant technical tools (e.g., Camera Angles, Mise en scène).
+1

5. AI Chaining (Mentor & Model):

Create a logic for chaining metadata (Form + Convention + Feature + Effect + Lens) into pre-defined prompts for Gemini.

Design the [Paragraph Example] button to trigger a read-only 'Locked Model' overlay that prevents copy-pasting but allows for 'Ghostwriting' (tracing the logic).

Please provide a technical roadmap detailing the sequence of these updates and how you intend to manage the state transitions between the macro (Essay) and micro (TEEL) views.