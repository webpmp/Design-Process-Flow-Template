Enhance the existing kanban-based design project estimator with a dependency-driven planning system and a structured layout that clearly separates execution-critical work from flexible work.

⸻

CORE FEATURE: DEPENDENCY SYSTEM

Each task must support a “Blocked by” relationship.
	•	Only allow users to define “Blocked by” dependencies
	•	“Blocks” relationships must be automatically inferred
	•	Tasks can have zero or multiple prerequisites
	•	Dependencies must only point to earlier or logically preceding tasks

⸻

DEPENDENCY UI (TASK CARD)

Each task card must include a link icon for managing dependencies.

Behavior:
	•	Icon appears on hover or if dependencies exist
	•	If dependencies exist, show a small badge with count (number of prerequisites)

Clicking the link icon opens an overlay panel.

⸻

DEPENDENCY OVERLAY

Structure:
	1.	Selected prerequisites (top)

	•	List of currently assigned dependencies
	•	Each item removable

	2.	Suggested prerequisites

	•	Prioritized based on phase order and common workflow logic
	•	Earlier phase tasks appear first

	3.	All valid tasks grouped by phase:

	•	Discovery
	•	Define
	•	Concept
	•	Design
	•	Deliver

Rules:
	•	Do not show tasks from later phases
	•	Prevent selecting the current task
	•	Prevent circular dependencies
	•	Prevent forward-only invalid dependencies

Interaction:
	•	Selecting a task adds it as a prerequisite
	•	Removing a task deletes the dependency instantly
	•	Changes apply immediately without confirmation

⸻

DEPENDENCY VISUALIZATION (GLOBAL)

After dependencies exist, the system must visually express execution structure.

Each phase column must be split into two sections:
	1.	CRITICAL PATH (top)
	2.	FLEXIBLE WORK (bottom)

⸻

CRITICAL PATH LOGIC

A task is part of the critical path if:
	•	It blocks at least one other task (has downstream impact), OR
	•	It is part of a dependency chain that affects overall completion timing

These tasks define execution order and timeline constraints.

⸻

FLEXIBLE WORK LOGIC

Tasks that:
	•	Have no downstream impact
	•	Are not part of a dependency chain affecting project completion
	•	Can be executed without blocking others

These tasks are non-critical and can be worked on at any time.

⸻

CRITICAL PATH VISUAL STYLE
	•	Slightly larger task cards
	•	Strong left border accent
	•	Subtle background tint
	•	Automatically sorted (no manual ordering)

Ordering:
	•	Dependency depth (earliest execution first)
	•	Then by longer duration

Optional:
	•	Display execution sequence number within each phase

⸻

FLEXIBLE WORK VISUAL STYLE
	•	Standard card styling
	•	Lower visual emphasis (slightly reduced opacity)
	•	Simple vertical stacking
	•	Manual ordering allowed

⸻

TASK DEPENDENCY INDICATORS

Each task card must show:
	•	↑ number = prerequisites (blocked by)
	•	↓ number = dependent tasks (blocks)

Example:
↑2 ↓3

Rules:
	•	High ↓ = high impact task
	•	High ↑ = highly constrained task
	•	↑0 ↓0 = independent task

⸻

INTERACTION: HOVER PATH VISUALIZATION

On hover of any task:
	•	Highlight all upstream dependencies
	•	Highlight all downstream dependents
	•	Fade unrelated tasks across all columns

This creates a temporary full dependency chain view.

⸻

CROSS-COLUMN FLOW

Critical Path tasks should visually align across columns to reinforce execution flow:

Discovery → Define → Concept → Design → Deliver

If perfect alignment is not possible:
	•	Add subtle vertical guide background for critical path alignment

⸻

REAL-TIME UPDATES

Whenever dependencies change:
	•	Recalculate critical path membership immediately
	•	Move tasks between Critical Path and Flexible Work automatically
	•	Update all indicators (↑ ↓ counts, styling, ordering)

No manual refresh required.

⸻

CONSTRAINTS
	•	No task can appear in both sections
	•	No manual override of critical path assignment
	•	No persistent dependency lines (only hover-based visualization)
	•	Keep interface minimal and scan-friendly

⸻

ADD TASK PLACEMENT (UPDATED INSTRUCTION)

Move all “Add Task” controls from the bottom of each column.

New placement:

PRIMARY:
	•	Place “Add Task” button directly under each column header
	•	It must sit above both Critical Path and Flexible Work sections
	•	This is the main entry point for task creation

SECONDARY:
	•	Add a lightweight “+ Add Task” control at the top of the Flexible Work section only
	•	This allows quick insertion into the default task pool

REMOVE:
	•	Completely remove all bottom-of-column Add Task buttons

⸻

TASK CREATION RULES

When a task is created:
	•	It is always added to Flexible Work by default
	•	It starts with no dependencies (↑0 ↓0)
	•	It uses neutral styling
	•	It does not appear in Critical Path until dependencies justify it

No manual assignment to Critical Path is allowed.

⸻

GOAL

The system must make it immediately clear:
	•	Which tasks define execution order (Critical Path)
	•	Which tasks are optional or flexible (Flexible Work)
	•	Which tasks are blocking or blocked

All structure must emerge from dependencies, not manual sorting or placement.