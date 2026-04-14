import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Eye, EyeOff, GripVertical, Plus, X, Edit2, Link2, ArrowUp, ArrowDown } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  shortEstimate: number;
  longEstimate: number;
  phase: string;
  visible: boolean;
  description: string;
  hasArrowAfter: boolean;
  blockedBy: string[]; // Array of task IDs this task depends on
}

interface Phase {
  id: string;
  name: string;
  visible: boolean;
  description?: string;
  color: {
    bg: string;
    border: string;
    header: string;
  };
}

const initialTasks: Task[] = [
  // Discovery Phase
  { id: '1', name: 'Competitive Analysis', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Evaluate competitor products and services to identify strengths, weaknesses, and market opportunities.', hasArrowAfter: true, blockedBy: [] },
  { id: '2', name: 'User Interviews', shortEstimate: 3, longEstimate: 7, phase: 'Discovery', visible: true, description: 'Conduct one-on-one interviews with target users to understand their needs, behaviors, and pain points.', hasArrowAfter: true, blockedBy: [] },
  { id: '3', name: 'Stakeholder Interviews', shortEstimate: 2, longEstimate: 4, phase: 'Discovery', visible: true, description: 'Meet with key stakeholders to align on business goals, constraints, and success metrics.', hasArrowAfter: true, blockedBy: [] },
  { id: '4', name: 'Contextual Inquiry', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Observe users in their natural environment to understand workflow and context of use.', hasArrowAfter: true, blockedBy: [] },
  { id: '5', name: 'Market Research', shortEstimate: 3, longEstimate: 6, phase: 'Discovery', visible: true, description: 'Analyze market trends, user demographics, and industry standards to inform design decisions.', hasArrowAfter: true, blockedBy: [] },
  { id: '6', name: 'Analytics Review', shortEstimate: 1, longEstimate: 3, phase: 'Discovery', visible: true, description: 'Review existing analytics data to identify usage patterns, drop-off points, and areas for improvement.', hasArrowAfter: true, blockedBy: [] },
  { id: '27', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Discovery', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true, blockedBy: [] },
  { id: '28', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Discovery', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true, blockedBy: [] },

  // Define Phase
  { id: '7', name: 'Synthesize User Research', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Analyze data from discovery phase (interviews, observations) to find patterns and insights.', hasArrowAfter: true, blockedBy: [] },
  { id: '8', name: 'Create User Personas', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Develop fictional characters that represent key user segments with their goals and behaviors.', hasArrowAfter: true, blockedBy: [] },
  { id: '9', name: 'Map User Journeys', shortEstimate: 2, longEstimate: 5, phase: 'Define', visible: true, description: 'Document the end-to-end experience of users interacting with the product or service.', hasArrowAfter: true, blockedBy: [] },
  { id: '10', name: 'Formulate Problem Statements', shortEstimate: 1, longEstimate: 3, phase: 'Define', visible: true, description: 'Define clear, actionable problem statements that frame the design challenge.', hasArrowAfter: true, blockedBy: [] },
  { id: '11', name: 'Define Objectives & Scope', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'Establish project goals, success criteria, and boundaries for the design effort.', hasArrowAfter: true, blockedBy: [] },
  { id: '12', name: 'Conduct Task Analysis', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Break down user tasks into detailed steps to understand complexity and requirements.', hasArrowAfter: true, blockedBy: [] },
  { id: '29', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true, blockedBy: [] },
  { id: '30', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true, blockedBy: [] },

  // Concept Phase
  { id: '13', name: 'User Stories', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Write user stories in the format "As a [user], I want to [action] so that [benefit]".', hasArrowAfter: true, blockedBy: [] },
  { id: '14', name: 'Sketching & Brainstorming', shortEstimate: 2, longEstimate: 5, phase: 'Concept', visible: true, description: 'Generate multiple design concepts through rapid sketching and ideation sessions.', hasArrowAfter: true, blockedBy: [] },
  { id: '15', name: 'Affinity Diagramming', shortEstimate: 1, longEstimate: 3, phase: 'Concept', visible: true, description: 'Organize ideas and insights into related groups to identify themes and priorities.', hasArrowAfter: true, blockedBy: [] },
  { id: '16', name: 'Story Mapping & Task Flows', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create visual representations of user flows showing how users move through tasks.', hasArrowAfter: true, blockedBy: [] },
  { id: '17', name: 'Low-Fidelity Wireframing', shortEstimate: 3, longEstimate: 6, phase: 'Concept', visible: true, description: 'Develop basic wireframes to explore layout and information architecture concepts.', hasArrowAfter: true, blockedBy: [] },
  { id: '18', name: 'Paper Prototyping', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create quick, low-cost prototypes on paper to test concepts with users early.', hasArrowAfter: true, blockedBy: [] },
  { id: '31', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Concept', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true, blockedBy: [] },
  { id: '32', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Concept', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true, blockedBy: [] },

  // Design Phase
  { id: '19', name: 'Wireframing', shortEstimate: 3, longEstimate: 7, phase: 'Design', visible: true, description: 'Create detailed wireframes that define layout, content hierarchy, and interactions.', hasArrowAfter: true, blockedBy: [] },
  { id: '20', name: 'UI/Visual Design', shortEstimate: 5, longEstimate: 10, phase: 'Design', visible: true, description: 'Apply visual design including typography, color, imagery, and branding elements.', hasArrowAfter: true, blockedBy: [] },
  { id: '21', name: 'Interactive Prototyping', shortEstimate: 3, longEstimate: 6, phase: 'Design', visible: true, description: 'Build clickable prototypes that simulate the user experience for testing and validation.', hasArrowAfter: true, blockedBy: [] },
  { id: '26', name: 'Motion Design', shortEstimate: 2, longEstimate: 5, phase: 'Design', visible: true, description: 'Design and create animations, transitions, and micro-interactions to enhance user experience and guide attention.', hasArrowAfter: true, blockedBy: [] },
  { id: '22', name: 'UX Writing', shortEstimate: 2, longEstimate: 4, phase: 'Design', visible: true, description: 'Craft clear, concise microcopy for UI elements, error messages, and help text.', hasArrowAfter: true, blockedBy: [] },
  { id: '33', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Design', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true, blockedBy: [] },
  { id: '34', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Design', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true, blockedBy: [] },

  // Deliver Phase
  { id: '23', name: 'Design Documentation', shortEstimate: 2, longEstimate: 5, phase: 'Deliver', visible: true, description: 'Create comprehensive documentation including design specifications and guidelines.', hasArrowAfter: true, blockedBy: [] },
  { id: '24', name: 'Developer Handoff/Review', shortEstimate: 2, longEstimate: 4, phase: 'Deliver', visible: true, description: 'Collaborate with developers to ensure accurate implementation of designs.', hasArrowAfter: true, blockedBy: [] },
  { id: '25', name: 'QA', shortEstimate: 3, longEstimate: 6, phase: 'Deliver', visible: true, description: 'Test the implemented design to verify it meets requirements and quality standards.', hasArrowAfter: true, blockedBy: [] },
  { id: '35', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Deliver', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true, blockedBy: [] },
  { id: '36', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Deliver', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true, blockedBy: [] },
];

const colorOptions = [
  { bg: 'bg-purple-100', border: 'border-purple-300', header: 'bg-purple-600', name: 'Purple' },
  { bg: 'bg-blue-100', border: 'border-blue-300', header: 'bg-blue-600', name: 'Blue' },
  { bg: 'bg-green-100', border: 'border-green-300', header: 'bg-green-600', name: 'Green' },
  { bg: 'bg-orange-100', border: 'border-orange-300', header: 'bg-orange-600', name: 'Orange' },
  { bg: 'bg-pink-100', border: 'border-pink-300', header: 'bg-pink-600', name: 'Pink' },
  { bg: 'bg-red-100', border: 'border-red-300', header: 'bg-red-600', name: 'Red' },
  { bg: 'bg-yellow-100', border: 'border-yellow-300', header: 'bg-yellow-600', name: 'Yellow' },
  { bg: 'bg-teal-100', border: 'border-teal-300', header: 'bg-teal-600', name: 'Teal' },
  { bg: 'bg-indigo-100', border: 'border-indigo-300', header: 'bg-indigo-600', name: 'Indigo' },
];

const initialPhases: Phase[] = [
  {
    id: 'Discovery',
    name: 'Discovery',
    visible: true,
    color: colorOptions[0],
    description: 'Identify the problem space through user research, stakeholder input, and existing data. Focus on understanding behaviors, needs, and constraints rather than jumping to solutions. Outputs frame what matters and why.'
  },
  {
    id: 'Define',
    name: 'Define',
    visible: true,
    color: colorOptions[1],
    description: 'Synthesize research into clear problem statements, user needs, and success criteria. Establish priorities, align stakeholders, and set direction. This phase turns ambiguity into a focused design target.'
  },
  {
    id: 'Concept',
    name: 'Concept',
    visible: true,
    color: colorOptions[2],
    description: 'Explore multiple solution directions quickly through sketches, flows, and low-fidelity prototypes. Test early ideas to validate assumptions and eliminate weak directions. Emphasis is on breadth before depth.'
  },
  {
    id: 'Design',
    name: 'Design',
    visible: true,
    color: colorOptions[3],
    description: 'Develop the chosen concept into detailed, high-fidelity experiences. Refine interactions, visual systems, and content with iterative testing and feedback. Ensure usability, accessibility, and consistency across the product.'
  },
  {
    id: 'Deliver',
    name: 'Deliver',
    visible: true,
    color: colorOptions[4],
    description: 'Prepare final design artifacts, specifications, and documentation for handoff. Support teams with clarifications, QA, and validation to ensure the experience is built as intended. Measure outcomes against the original goals.'
  },
];

interface DependencyOverlayProps {
  task: Task;
  allTasks: Task[];
  phases: Phase[];
  onAddDependency: (taskId: string, prerequisiteId: string) => void;
  onRemoveDependency: (taskId: string, prerequisiteId: string) => void;
  onClose: () => void;
  getValidPrerequisites: (taskId: string) => Task[];
}

const DependencyOverlay = ({
  task,
  allTasks,
  phases,
  onAddDependency,
  onRemoveDependency,
  onClose,
  getValidPrerequisites,
}: DependencyOverlayProps) => {
  const validPrerequisites = getValidPrerequisites(task.id);
  const selectedPrerequisites = allTasks.filter(t => task.blockedBy.includes(t.id));

  // Suggest prerequisites from earlier phases
  const phaseOrder = phases.map(p => p.id);
  const taskPhaseIndex = phaseOrder.indexOf(task.phase);
  const suggestedPrerequisites = validPrerequisites.filter(t => {
    const tPhaseIndex = phaseOrder.indexOf(t.phase);
    return tPhaseIndex < taskPhaseIndex && !task.blockedBy.includes(t.id);
  }).slice(0, 5);

  // Group valid prerequisites by phase
  const tasksByPhase = phases.reduce((acc, phase) => {
    const phaseTasks = validPrerequisites.filter(t => t.phase === phase.id && !task.blockedBy.includes(t.id));
    if (phaseTasks.length > 0) {
      acc[phase.id] = { phase, tasks: phaseTasks };
    }
    return acc;
  }, {} as Record<string, { phase: Phase; tasks: Task[] }>);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Dependencies</h2>
            <p className="text-sm text-gray-600 mt-1">{task.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selected Prerequisites */}
          {selectedPrerequisites.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Prerequisites ({selectedPrerequisites.length})</h3>
              <div className="space-y-2">
                {selectedPrerequisites.map(prereq => {
                  const phase = phases.find(p => p.id === prereq.phase);
                  return (
                    <div
                      key={prereq.id}
                      className={`flex items-center justify-between p-3 ${phase?.color.bg} border ${phase?.color.border} rounded`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{prereq.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{phase?.name}</div>
                      </div>
                      <button
                        onClick={() => onRemoveDependency(task.id, prereq.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Remove dependency"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested Prerequisites */}
          {suggestedPrerequisites.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested Prerequisites</h3>
              <div className="space-y-2">
                {suggestedPrerequisites.map(prereq => {
                  const phase = phases.find(p => p.id === prereq.phase);
                  return (
                    <button
                      key={prereq.id}
                      onClick={() => onAddDependency(task.id, prereq.id)}
                      className={`w-full flex items-center justify-between p-3 ${phase?.color.bg} border ${phase?.color.border} rounded hover:shadow-md transition-shadow text-left`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{prereq.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{phase?.name}</div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Valid Tasks Grouped by Phase */}
          {Object.keys(tasksByPhase).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">All Available Tasks</h3>
              <div className="space-y-4">
                {Object.values(tasksByPhase).map(({ phase, tasks }) => (
                  <div key={phase.id}>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">{phase.name}</h4>
                    <div className="space-y-2">
                      {tasks.map(prereq => (
                        <button
                          key={prereq.id}
                          onClick={() => onAddDependency(task.id, prereq.id)}
                          className={`w-full flex items-center justify-between p-2 ${phase.color.bg} border ${phase.color.border} rounded hover:shadow-md transition-shadow text-left`}
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{prereq.name}</div>
                          </div>
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validPrerequisites.length === 0 && selectedPrerequisites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No valid prerequisites available for this task.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  index: number;
  phase: string;
  phaseColor: { bg: string; border: string; header: string };
  updateEstimate: (id: string, type: 'short' | 'long', value: string) => void;
  toggleVisibility: (id: string) => void;
  moveTask: (dragIndex: number, hoverIndex: number, phase: string) => void;
  isLastInPhase: boolean;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onToggleArrow: (id: string) => void;
  onOpenDependencyOverlay: (id: string) => void;
  dependentCount: number;
  isCriticalPath: boolean;
  isHighlighted: boolean;
  isFaded: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}

const TaskCard = ({
  task,
  index,
  phase,
  phaseColor,
  updateEstimate,
  toggleVisibility,
  moveTask,
  isLastInPhase,
  isExpanded,
  onToggleExpanded,
  onUpdateDescription,
  onToggleArrow,
  onOpenDependencyOverlay,
  dependentCount,
  isCriticalPath,
  isHighlighted,
  isFaded,
  onHoverStart,
  onHoverEnd,
}: TaskCardProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TASK',
    item: { index, phase },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { index: number; phase: string }) => {
      if (item.phase !== phase) return;
      if (item.index === index) return;
      
      moveTask(item.index, index, phase);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  return (
    <div ref={drop}>
      <div
        ref={preview}
        className={`${isDragging ? 'opacity-50' : ''} ${isOver ? 'border-blue-500' : ''}`}
      >
        {/* Task Box */}
        <div
          className={`
            border-2
            ${task.visible ? phaseColor.border : 'border-gray-300'}
            ${task.visible ? phaseColor.bg : 'bg-gray-100'}
            p-4 min-w-[240px] relative cursor-pointer transition-all
            ${isExpanded ? 'min-h-[200px]' : ''}
            ${isCriticalPath ? 'border-l-4 border-l-gray-800 shadow-sm' : ''}
            ${isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}
            ${isFaded ? 'opacity-30' : ''}
          `}
          id={`task-${task.id}`}
          onMouseEnter={() => onHoverStart(task.id)}
          onMouseLeave={onHoverEnd}
        >
          {/* Drag handle and visibility toggle */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <button
              ref={drag}
              className="cursor-move p-1 hover:bg-gray-200 rounded"
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(task.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
              title={task.visible ? 'Hide task' : 'Show task'}
            >
              {task.visible ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          
          {/* Main clickable area */}
          <div onClick={() => onToggleExpanded(task.id)}>
            {/* Estimates in corners */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={task.shortEstimate}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateEstimate(task.id, 'short', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-12 text-xs px-1 py-0.5 border border-gray-300 rounded text-center font-semibold ${task.visible ? 'bg-green-50' : 'bg-gray-200'}`}
                  min="0"
                />
                <span className={`text-xs ${task.visible ? 'text-gray-600' : 'text-gray-400'}`}>d</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={task.longEstimate}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateEstimate(task.id, 'long', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-12 text-xs px-1 py-0.5 border border-gray-300 rounded text-center font-semibold ${task.visible ? 'bg-red-50' : 'bg-gray-200'}`}
                  min="0"
                />
                <span className={`text-xs ${task.visible ? 'text-gray-600' : 'text-gray-400'}`}>d</span>
              </div>
            </div>
            
            {/* Task Name */}
            <div className={`text-sm text-center font-medium px-2 ${task.visible ? 'text-gray-900' : 'text-gray-400'}`}>
              {task.name}
            </div>

            {/* Dependency Indicators and Link Icon */}
            <div className="flex items-center justify-center gap-3 mt-3">
              {/* Dependency counts */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {task.blockedBy.length > 0 && (
                  <div className="flex items-center gap-0.5" title={`Blocked by ${task.blockedBy.length} task(s)`}>
                    <ArrowUp className="w-3 h-3" />
                    <span className="font-semibold">{task.blockedBy.length}</span>
                  </div>
                )}
                {dependentCount > 0 && (
                  <div className="flex items-center gap-0.5" title={`Blocks ${dependentCount} task(s)`}>
                    <ArrowDown className="w-3 h-3" />
                    <span className="font-semibold">{dependentCount}</span>
                  </div>
                )}
              </div>

              {/* Link icon for managing dependencies */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDependencyOverlay(task.id);
                }}
                className="relative p-1 hover:bg-gray-200 rounded transition-colors"
                title="Manage dependencies"
              >
                <Link2 className="w-4 h-4 text-gray-600" />
                {task.blockedBy.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {task.blockedBy.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Description */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-300" onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={task.description}
                onChange={(e) => onUpdateDescription(task.id, e.target.value)}
                className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter task description..."
              />
            </div>
          )}
        </div>
        
        {/* Arrow to next task (if not last task in phase) */}
        {!isLastInPhase && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleArrow(task.id);
            }}
            className="flex justify-center py-2 relative hover:bg-gray-100 transition-colors cursor-pointer w-full group"
            title={task.hasArrowAfter ? "Click to mark tasks as concurrent" : "Click to mark tasks as sequential"}
          >
            {task.hasArrowAfter ? (
              <>
                <div className="w-0.5 h-4 bg-gray-800 group-hover:bg-blue-600"></div>
                <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800 group-hover:border-t-blue-600" style={{ top: '16px' }}></div>
              </>
            ) : (
              <div className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                ⫽ Concurrent
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

interface PhaseColumnProps {
  phase: Phase;
  index: number;
  phaseTasks: Task[];
  isLastPhase: boolean;
  updateEstimate: (id: string, type: 'short' | 'long', value: string) => void;
  toggleVisibility: (id: string) => void;
  moveTask: (dragIndex: number, hoverIndex: number, phase: string) => void;
  expandedTaskId: string | null;
  toggleExpanded: (id: string) => void;
  updateDescription: (id: string, description: string) => void;
  toggleArrow: (id: string) => void;
  addTask: (phase: string) => void;
  movePhase: (dragIndex: number, hoverIndex: number) => void;
  renamePhase: (id: string, newName: string) => void;
  togglePhaseVisibility: (id: string) => void;
  removePhase: (id: string) => void;
  onOpenDependencyOverlay: (id: string) => void;
  getTaskDependents: (taskId: string) => Task[];
  isOnCriticalPath: (taskId: string) => boolean;
  hoveredTaskId: string | null;
  getUpstreamDependencies: (taskId: string) => string[];
  getDownstreamDependents: (taskId: string) => string[];
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}

const PhaseColumn = ({
  phase,
  index,
  phaseTasks,
  isLastPhase,
  updateEstimate,
  toggleVisibility,
  moveTask,
  expandedTaskId,
  toggleExpanded,
  updateDescription,
  toggleArrow,
  addTask,
  movePhase,
  renamePhase,
  togglePhaseVisibility,
  removePhase,
  onOpenDependencyOverlay,
  getTaskDependents,
  isOnCriticalPath,
  hoveredTaskId,
  getUpstreamDependencies,
  getDownstreamDependents,
  onHoverStart,
  onHoverEnd,
}: PhaseColumnProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(phase.name);

  const [{ isDragging }, drag] = useDrag({
    type: 'PHASE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PHASE',
    hover: (item: { index: number }) => {
      if (item.index === index) return;
      
      movePhase(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleNameSave = () => {
    if (editedName.trim()) {
      renamePhase(phase.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditedName(phase.name);
      setIsEditingName(false);
    }
  };

  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={`flex flex-col border-r border-gray-300 last:border-r-0 relative ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-blue-50' : ''}`}
    >
      {/* Phase Header */}
      <div className={`${phase.color.header} text-white px-6 py-4 text-center font-semibold min-w-[280px] relative group`}>
        <div className="flex items-center justify-center gap-2">
          <button
            ref={drag}
            className="cursor-move p-1 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Drag to reorder phase"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="bg-white text-gray-900 px-2 py-1 rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span onClick={() => setIsEditingName(true)} className="cursor-pointer">
              {phase.name}
            </span>
          )}
          
          <button
            onClick={() => setIsEditingName(true)}
            className="p-1 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Rename phase"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Phase controls */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => togglePhaseVisibility(phase.id)}
            className="p-1 hover:bg-white/20 rounded"
            title={phase.visible ? 'Hide phase' : 'Show phase'}
          >
            {phase.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => removePhase(phase.id)}
            className="p-1 hover:bg-white/20 rounded"
            title="Remove phase"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Add Task Button (Primary - under header) */}
      {phase.visible && (
        <div className="px-6 pt-4">
          <button
            onClick={() => addTask(phase.id)}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800"
            title="Add new task"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Task</span>
          </button>
        </div>
      )}

      {/* Tasks */}
      {phase.visible && (() => {
        // Split tasks into critical path and flexible work
        const criticalPathTasks = phaseTasks.filter(task => isOnCriticalPath(task.id));
        const flexibleWorkTasks = phaseTasks.filter(task => !isOnCriticalPath(task.id));

        // Sort critical path tasks by dependency depth and duration
        const sortedCriticalTasks = [...criticalPathTasks].sort((a, b) => {
          const aDepth = a.blockedBy.length;
          const bDepth = b.blockedBy.length;
          if (aDepth !== bDepth) return aDepth - bDepth;
          return b.longEstimate - a.longEstimate;
        });

        const upstreamIds = hoveredTaskId ? getUpstreamDependencies(hoveredTaskId) : [];
        const downstreamIds = hoveredTaskId ? getDownstreamDependents(hoveredTaskId) : [];

        const renderTask = (task: Task, taskIndex: number, isCritical: boolean) => {
          const isHighlighted = hoveredTaskId === task.id ||
                               upstreamIds.includes(task.id) ||
                               downstreamIds.includes(task.id);
          const isFaded = hoveredTaskId !== null && !isHighlighted;

          return (
            <TaskCard
              key={task.id}
              task={task}
              index={taskIndex}
              phase={phase.id}
              phaseColor={phase.color}
              updateEstimate={updateEstimate}
              toggleVisibility={toggleVisibility}
              moveTask={moveTask}
              isLastInPhase={false}
              isExpanded={expandedTaskId === task.id}
              onToggleExpanded={toggleExpanded}
              onUpdateDescription={updateDescription}
              onToggleArrow={toggleArrow}
              onOpenDependencyOverlay={onOpenDependencyOverlay}
              dependentCount={getTaskDependents(task.id).length}
              isCriticalPath={isCritical}
              isHighlighted={isHighlighted}
              isFaded={isFaded}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
            />
          );
        };

        return (
          <div className="flex-1">
            {/* Critical Path Section */}
            {sortedCriticalTasks.length > 0 && (
              <div className="px-6 pt-4 pb-6">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Critical Path</h3>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="pl-8 space-y-4">
                  {sortedCriticalTasks.map((task, idx) => renderTask(task, idx, true))}
                </div>
              </div>
            )}

            {/* Flexible Work Section */}
            <div className="px-6 pb-6">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Flexible Work</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <button
                  onClick={() => addTask(phase.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  title="Add task to flexible work"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              <div className="pl-8 space-y-4">
                {flexibleWorkTasks.length > 0 ? (
                  flexibleWorkTasks.map((task, idx) => renderTask(task, idx, false))
                ) : (
                  <div className="text-center py-4 text-sm text-gray-400">
                    No flexible tasks
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showPhaseBreakdown, setShowPhaseBreakdown] = useState(false);
  const [editingPhaseName, setEditingPhaseName] = useState<string | null>(null);
  const [editingPhaseDesc, setEditingPhaseDesc] = useState<string | null>(null);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [dependencyOverlayTaskId, setDependencyOverlayTaskId] = useState<string | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const updateEstimate = (id: string, type: 'short' | 'long', value: string) => {
    const numValue = parseInt(value) || 0;
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, [type === 'short' ? 'shortEstimate' : 'longEstimate']: numValue }
        : task
    ));
  };

  const toggleVisibility = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, visible: !task.visible } : task
    ));
  };

  const toggleExpanded = (id: string) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const updateDescription = (id: string, description: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, description } : task
    ));
  };

  const toggleArrow = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, hasArrowAfter: !task.hasArrowAfter } : task
    ));
  };

  const addTask = (phaseId: string) => {
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newTask: Task = {
      id: newId,
      name: 'New Task',
      shortEstimate: 1,
      longEstimate: 3,
      phase: phaseId,
      visible: true,
      description: '',
      hasArrowAfter: true,
      blockedBy: [],
    };
    
    const phaseTasks = tasks.filter(t => t.phase === phaseId);
    const otherTasks = tasks.filter(t => t.phase !== phaseId);
    
    const newTasks: Task[] = [];
    phases.forEach(p => {
      if (p.id === phaseId) {
        newTasks.push(...phaseTasks, newTask);
      } else {
        newTasks.push(...otherTasks.filter(t => t.phase === p.id));
      }
    });
    
    setTasks(newTasks);
    setExpandedTaskId(newId);
  };

  const moveTask = (dragIndex: number, hoverIndex: number, phaseId: string) => {
    const phaseTasks = tasks.filter(task => task.phase === phaseId);
    const otherTasks = tasks.filter(task => task.phase !== phaseId);
    
    const dragTask = phaseTasks[dragIndex];
    const newPhaseTasks = [...phaseTasks];
    newPhaseTasks.splice(dragIndex, 1);
    newPhaseTasks.splice(hoverIndex, 0, dragTask);
    
    const newTasks: Task[] = [];
    phases.forEach(p => {
      if (p.id === phaseId) {
        newTasks.push(...newPhaseTasks);
      } else {
        newTasks.push(...otherTasks.filter(t => t.phase === p.id));
      }
    });
    
    setTasks(newTasks);
  };

  const movePhase = (dragIndex: number, hoverIndex: number) => {
    const newPhases = [...phases];
    const dragPhase = newPhases[dragIndex];
    newPhases.splice(dragIndex, 1);
    newPhases.splice(hoverIndex, 0, dragPhase);
    setPhases(newPhases);
  };

  const renamePhase = (id: string, newName: string) => {
    setPhases(phases.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const updatePhaseDescription = (id: string, description: string) => {
    setPhases(phases.map(p => p.id === id ? { ...p, description } : p));
  };

  const togglePhaseVisibility = (id: string) => {
    setPhases(phases.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  const removePhase = (id: string) => {
    if (phases.length <= 1) {
      alert('You must have at least one phase.');
      return;
    }
    
    const confirmRemove = window.confirm('Are you sure you want to remove this phase? All tasks in this phase will also be removed.');
    if (!confirmRemove) return;
    
    setPhases(phases.filter(p => p.id !== id));
    setTasks(tasks.filter(t => t.phase !== id));
  };

  const addPhase = () => {
    const newId = `phase-${Date.now()}`;
    const colorIndex = phases.length % colorOptions.length;
    const newPhase: Phase = {
      id: newId,
      name: 'New Phase',
      visible: true,
      color: colorOptions[colorIndex],
    };
    setPhases([...phases, newPhase]);
  };

  // Dependency management functions
  const addDependency = (taskId: string, prerequisiteId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId && !task.blockedBy.includes(prerequisiteId)
        ? { ...task, blockedBy: [...task.blockedBy, prerequisiteId] }
        : task
    ));
  };

  const removeDependency = (taskId: string, prerequisiteId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, blockedBy: task.blockedBy.filter(id => id !== prerequisiteId) }
        : task
    ));
  };

  const getTaskDependents = (taskId: string): Task[] => {
    return tasks.filter(task => task.blockedBy.includes(taskId));
  };

  const getTaskDependencies = (taskId: string): Task[] => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];
    return tasks.filter(t => task.blockedBy.includes(t.id));
  };

  const wouldCreateCircularDependency = (taskId: string, prerequisiteId: string): boolean => {
    const visited = new Set<string>();

    const hasPath = (from: string, to: string): boolean => {
      if (from === to) return true;
      if (visited.has(from)) return false;
      visited.add(from);

      const task = tasks.find(t => t.id === from);
      if (!task) return false;

      return task.blockedBy.some(depId => hasPath(depId, to));
    };

    return hasPath(prerequisiteId, taskId);
  };

  const getValidPrerequisites = (taskId: string): Task[] => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];

    const phaseOrder = phases.map(p => p.id);
    const taskPhaseIndex = phaseOrder.indexOf(task.phase);

    return tasks.filter(t => {
      if (t.id === taskId) return false;
      const tPhaseIndex = phaseOrder.indexOf(t.phase);
      if (tPhaseIndex > taskPhaseIndex) return false;
      if (wouldCreateCircularDependency(taskId, t.id)) return false;
      return true;
    });
  };

  const getUpstreamDependencies = (taskId: string): string[] => {
    const result = new Set<string>();

    const traverse = (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      task.blockedBy.forEach(depId => {
        if (!result.has(depId)) {
          result.add(depId);
          traverse(depId);
        }
      });
    };

    traverse(taskId);
    return Array.from(result);
  };

  const getDownstreamDependents = (taskId: string): string[] => {
    const result = new Set<string>();

    const traverse = (id: string) => {
      const dependents = getTaskDependents(id);
      dependents.forEach(dep => {
        if (!result.has(dep.id)) {
          result.add(dep.id);
          traverse(dep.id);
        }
      });
    };

    traverse(taskId);
    return Array.from(result);
  };

  const isOnCriticalPath = (taskId: string): boolean => {
    return getTaskDependents(taskId).length > 0;
  };

  // Calculate total with concurrent task support
  const calculateTotalWithConcurrency = (type: 'short' | 'long') => {
    let total = 0;
    
    const visibleTasks = tasks.filter(t => t.visible);
    const visiblePhases = phases.filter(p => p.visible);
    
    visiblePhases.forEach(phase => {
      const phaseTasks = visibleTasks.filter(t => t.phase === phase.id);
      
      let i = 0;
      while (i < phaseTasks.length) {
        const concurrentGroup = [phaseTasks[i]];
        
        while (i < phaseTasks.length - 1 && !phaseTasks[i].hasArrowAfter) {
          i++;
          concurrentGroup.push(phaseTasks[i]);
        }
        
        const groupEstimate = Math.max(
          ...concurrentGroup.map(t => type === 'short' ? t.shortEstimate : t.longEstimate)
        );
        total += groupEstimate;
        
        i++;
      }
    });
    
    return total;
  };

  const getTotalShort = () => calculateTotalWithConcurrency('short');
  const getTotalLong = () => calculateTotalWithConcurrency('long');
  const getAverageEstimate = () => Math.round((getTotalShort() + getTotalLong()) / 2);

  const getPhaseEstimate = (phaseId: string, type: 'short' | 'long') => {
    const visibleTasks = tasks.filter(t => t.visible && t.phase === phaseId);
    let total = 0;
    
    let i = 0;
    while (i < visibleTasks.length) {
      const concurrentGroup = [visibleTasks[i]];
      
      while (i < visibleTasks.length - 1 && !visibleTasks[i].hasArrowAfter) {
        i++;
        concurrentGroup.push(visibleTasks[i]);
      }
      
      const groupEstimate = Math.max(
        ...concurrentGroup.map(t => type === 'short' ? t.shortEstimate : t.longEstimate)
      );
      total += groupEstimate;
      
      i++;
    }
    
    return total;
  };

  const formatDuration = (days: number) => {
    const weeks = (days / 5).toFixed(1);
    const months = (days / 20).toFixed(1);
    return { days, weeks, months };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-3xl">Design Process Flow</h1>
            <button
              onClick={() => setShowHowToUse(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              How to Use
            </button>
          </div>
          
          {/* Purpose Description */}
          <div className="mb-8 text-sm text-gray-600 max-w-[50%]">
            <p>This interactive flow diagram helps visualize and estimate time for completing design tasks across multiple phases. Use it to plan project timelines, track concurrent work streams, and communicate estimated durations with your team and stakeholders.</p>
          </div>
          
          {/* Project Duration Estimates */}
          <div className="mb-8 bg-white border-2 border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Project Duration Estimates</h2>
              <button
                onClick={() => setShowPhaseBreakdown(!showPhaseBreakdown)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                {showPhaseBreakdown ? 'Hide Phase Breakdown' : 'View Phase Breakdown'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Best Case */}
              <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-600 rounded">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Best Case Scenario</div>
                  <div className="text-2xl font-semibold text-green-700">{getTotalShort()} days</div>
                  <div className="text-xs text-green-600 mt-1">
                    {formatDuration(getTotalShort()).weeks} weeks • {formatDuration(getTotalShort()).months} months
                  </div>
                </div>
                <div className="text-green-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              {/* Average */}
              <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-600 rounded">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Average Estimate</div>
                  <div className="text-2xl font-semibold text-blue-700">
                    {getAverageEstimate()} days
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {formatDuration(getAverageEstimate()).weeks} weeks • {formatDuration(getAverageEstimate()).months} months
                  </div>
                </div>
                <div className="text-blue-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Worst Case */}
              <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-600 rounded">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Worst Case Scenario</div>
                  <div className="text-2xl font-semibold text-red-700">{getTotalLong()} days</div>
                  <div className="text-xs text-red-600 mt-1">
                    {formatDuration(getTotalLong()).weeks} weeks • {formatDuration(getTotalLong()).months} months
                  </div>
                </div>
                <div className="text-red-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Legend Items */}
            <div className="mt-6 flex gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-green-50 border border-gray-300 rounded"></div>
                <span>Shortest estimate (days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-red-50 border border-gray-300 rounded"></div>
                <span>Longest estimate (days)</span>
              </div>
            </div>

            {/* Phase Breakdown */}
            {showPhaseBreakdown && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Phase Duration Breakdown</h3>
                <div className="space-y-3">
                  {phases.filter(p => p.visible).map(phase => {
                    const shortEstimate = getPhaseEstimate(phase.id, 'short');
                    const longEstimate = getPhaseEstimate(phase.id, 'long');
                    const isEditingName = editingPhaseName === phase.id;
                    const isEditingDesc = editingPhaseDesc === phase.id;

                    return (
                      <div key={phase.id} className={`p-4 ${phase.color.bg} border ${phase.color.border} rounded`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            {isEditingName ? (
                              <input
                                type="text"
                                value={phase.name}
                                onChange={(e) => renamePhase(phase.id, e.target.value)}
                                onBlur={() => setEditingPhaseName(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') setEditingPhaseName(null);
                                  if (e.key === 'Escape') setEditingPhaseName(null);
                                }}
                                className="px-2 py-1 border border-gray-400 rounded font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <div
                                onClick={() => setEditingPhaseName(phase.id)}
                                className="font-semibold text-gray-900 cursor-pointer hover:bg-white/50 px-2 py-1 rounded"
                                title="Click to edit phase name"
                              >
                                {phase.name}
                              </div>
                            )}
                            <button
                              onClick={() => setEditingPhaseName(phase.id)}
                              className="p-1 hover:bg-white/50 rounded"
                              title="Edit phase name"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Shortest</div>
                              <div className="font-semibold text-green-700">{shortEstimate} days</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Longest</div>
                              <div className="font-semibold text-red-700">{longEstimate} days</div>
                            </div>
                          </div>
                        </div>
                        {isEditingDesc ? (
                          <div>
                            <textarea
                              value={phase.description || ''}
                              onChange={(e) => updatePhaseDescription(phase.id, e.target.value)}
                              onBlur={() => setEditingPhaseDesc(null)}
                              className="w-full min-h-[100px] p-2 text-sm border border-gray-400 rounded resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter phase description..."
                              autoFocus
                            />
                            <div className="mt-2 text-xs text-gray-500">Press Escape or click outside to finish editing</div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setEditingPhaseDesc(phase.id)}
                            className="text-sm text-gray-700 leading-relaxed cursor-pointer hover:bg-white/50 p-2 rounded"
                            title="Click to edit description"
                          >
                            {phase.description || 'Click to add description...'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Flow Diagram */}
          <div className="overflow-x-auto pb-8">
            <div className="inline-flex gap-0 border border-gray-300 bg-white">
              {phases.map((phase, phaseIndex) => {
                const phaseTasks = tasks.filter(task => task.phase === phase.id);
                
                return (
                  <PhaseColumn
                    key={phase.id}
                    phase={phase}
                    index={phaseIndex}
                    phaseTasks={phaseTasks}
                    isLastPhase={phaseIndex === phases.length - 1}
                    updateEstimate={updateEstimate}
                    toggleVisibility={toggleVisibility}
                    moveTask={moveTask}
                    expandedTaskId={expandedTaskId}
                    toggleExpanded={toggleExpanded}
                    updateDescription={updateDescription}
                    toggleArrow={toggleArrow}
                    addTask={addTask}
                    movePhase={movePhase}
                    renamePhase={renamePhase}
                    togglePhaseVisibility={togglePhaseVisibility}
                    removePhase={removePhase}
                    onOpenDependencyOverlay={setDependencyOverlayTaskId}
                    getTaskDependents={getTaskDependents}
                    isOnCriticalPath={isOnCriticalPath}
                    hoveredTaskId={hoveredTaskId}
                    getUpstreamDependencies={getUpstreamDependencies}
                    getDownstreamDependents={getDownstreamDependents}
                    onHoverStart={setHoveredTaskId}
                    onHoverEnd={() => setHoveredTaskId(null)}
                  />
                );
              })}
              
              {/* Add Phase Button */}
              <div className="flex flex-col items-center justify-center min-w-[100px] p-6 border-l border-gray-300">
                <button
                  onClick={addPhase}
                  className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800"
                  title="Add new phase"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs font-medium text-center">Add Phase</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dependency Overlay */}
          {dependencyOverlayTaskId && (() => {
            const task = tasks.find(t => t.id === dependencyOverlayTaskId);
            if (!task) return null;

            return (
              <DependencyOverlay
                task={task}
                allTasks={tasks}
                phases={phases}
                onAddDependency={addDependency}
                onRemoveDependency={removeDependency}
                onClose={() => setDependencyOverlayTaskId(null)}
                getValidPrerequisites={getValidPrerequisites}
              />
            );
          })()}

          {/* How to Use Overlay */}
          {showHowToUse && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowHowToUse(false)}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">How to Use This Template</h2>
                  <button
                    onClick={() => setShowHowToUse(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Close"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        <span className="font-semibold">Toggle tasks on/off</span> to include or exclude them from your estimate, or create and organize new tasks within each phase of your project.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        <span className="font-semibold">Drag and drop</span> to reorder tasks within phases or rearrange phases themselves to match your workflow.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        <span className="font-semibold">(Optional) Click on each card</span> to expand it and edit the description. This is helpful when collaborating with a team to estimate work effort.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        <span className="font-semibold">Estimate shortest and longest</span> number of days to complete each task. These estimates will be used to calculate your project timeline.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">When you're done:</p>
                    <p className="text-sm text-blue-800">
                      View the <span className="font-semibold">Best Case, Worst Case, and Average</span> estimates at the top of the page. These represent the overall project duration based on your task estimates.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowHowToUse(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}