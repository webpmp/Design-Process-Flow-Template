import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Eye, EyeOff, GripVertical, Plus, X, Edit2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  shortEstimate: number;
  longEstimate: number;
  phase: string;
  visible: boolean;
  description: string;
  hasArrowAfter: boolean;
}

interface Phase {
  id: string;
  name: string;
  visible: boolean;
  color: {
    bg: string;
    border: string;
    header: string;
  };
}

const initialTasks: Task[] = [
  // Discovery Phase
  { id: '1', name: 'Competitive Analysis', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Evaluate competitor products and services to identify strengths, weaknesses, and market opportunities.', hasArrowAfter: true },
  { id: '2', name: 'User Interviews', shortEstimate: 3, longEstimate: 7, phase: 'Discovery', visible: true, description: 'Conduct one-on-one interviews with target users to understand their needs, behaviors, and pain points.', hasArrowAfter: true },
  { id: '3', name: 'Stakeholder Interviews', shortEstimate: 2, longEstimate: 4, phase: 'Discovery', visible: true, description: 'Meet with key stakeholders to align on business goals, constraints, and success metrics.', hasArrowAfter: true },
  { id: '4', name: 'Contextual Inquiry', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Observe users in their natural environment to understand workflow and context of use.', hasArrowAfter: true },
  { id: '5', name: 'Market Research', shortEstimate: 3, longEstimate: 6, phase: 'Discovery', visible: true, description: 'Analyze market trends, user demographics, and industry standards to inform design decisions.', hasArrowAfter: true },
  { id: '6', name: 'Analytics Review', shortEstimate: 1, longEstimate: 3, phase: 'Discovery', visible: true, description: 'Review existing analytics data to identify usage patterns, drop-off points, and areas for improvement.', hasArrowAfter: true },
  { id: '27', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Discovery', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true },
  { id: '28', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Discovery', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true },
  
  // Define Phase
  { id: '7', name: 'Synthesize User Research', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Analyze data from discovery phase (interviews, observations) to find patterns and insights.', hasArrowAfter: true },
  { id: '8', name: 'Create User Personas', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Develop fictional characters that represent key user segments with their goals and behaviors.', hasArrowAfter: true },
  { id: '9', name: 'Map User Journeys', shortEstimate: 2, longEstimate: 5, phase: 'Define', visible: true, description: 'Document the end-to-end experience of users interacting with the product or service.', hasArrowAfter: true },
  { id: '10', name: 'Formulate Problem Statements', shortEstimate: 1, longEstimate: 3, phase: 'Define', visible: true, description: 'Define clear, actionable problem statements that frame the design challenge.', hasArrowAfter: true },
  { id: '11', name: 'Define Objectives & Scope', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'Establish project goals, success criteria, and boundaries for the design effort.', hasArrowAfter: true },
  { id: '12', name: 'Conduct Task Analysis', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Break down user tasks into detailed steps to understand complexity and requirements.', hasArrowAfter: true },
  { id: '29', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true },
  { id: '30', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true },
  
  // Concept Phase
  { id: '13', name: 'User Stories', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Write user stories in the format "As a [user], I want to [action] so that [benefit]".', hasArrowAfter: true },
  { id: '14', name: 'Sketching & Brainstorming', shortEstimate: 2, longEstimate: 5, phase: 'Concept', visible: true, description: 'Generate multiple design concepts through rapid sketching and ideation sessions.', hasArrowAfter: true },
  { id: '15', name: 'Affinity Diagramming', shortEstimate: 1, longEstimate: 3, phase: 'Concept', visible: true, description: 'Organize ideas and insights into related groups to identify themes and priorities.', hasArrowAfter: true },
  { id: '16', name: 'Story Mapping & Task Flows', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create visual representations of user flows showing how users move through tasks.', hasArrowAfter: true },
  { id: '17', name: 'Low-Fidelity Wireframing', shortEstimate: 3, longEstimate: 6, phase: 'Concept', visible: true, description: 'Develop basic wireframes to explore layout and information architecture concepts.', hasArrowAfter: true },
  { id: '18', name: 'Paper Prototyping', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create quick, low-cost prototypes on paper to test concepts with users early.', hasArrowAfter: true },
  { id: '31', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Concept', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true },
  { id: '32', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Concept', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true },
  
  // Design Phase
  { id: '19', name: 'Wireframing', shortEstimate: 3, longEstimate: 7, phase: 'Design', visible: true, description: 'Create detailed wireframes that define layout, content hierarchy, and interactions.', hasArrowAfter: true },
  { id: '20', name: 'UI/Visual Design', shortEstimate: 5, longEstimate: 10, phase: 'Design', visible: true, description: 'Apply visual design including typography, color, imagery, and branding elements.', hasArrowAfter: true },
  { id: '21', name: 'Interactive Prototyping', shortEstimate: 3, longEstimate: 6, phase: 'Design', visible: true, description: 'Build clickable prototypes that simulate the user experience for testing and validation.', hasArrowAfter: true },
  { id: '26', name: 'Motion Design', shortEstimate: 2, longEstimate: 5, phase: 'Design', visible: true, description: 'Design and create animations, transitions, and micro-interactions to enhance user experience and guide attention.', hasArrowAfter: true },
  { id: '22', name: 'UX Writing', shortEstimate: 2, longEstimate: 4, phase: 'Design', visible: true, description: 'Craft clear, concise microcopy for UI elements, error messages, and help text.', hasArrowAfter: true },
  { id: '33', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Design', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true },
  { id: '34', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Design', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true },
  
  // Deliver Phase
  { id: '23', name: 'Design Documentation', shortEstimate: 2, longEstimate: 5, phase: 'Deliver', visible: true, description: 'Create comprehensive documentation including design specifications and guidelines.', hasArrowAfter: true },
  { id: '24', name: 'Developer Handoff/Review', shortEstimate: 2, longEstimate: 4, phase: 'Deliver', visible: true, description: 'Collaborate with developers to ensure accurate implementation of designs.', hasArrowAfter: true },
  { id: '25', name: 'QA', shortEstimate: 3, longEstimate: 6, phase: 'Deliver', visible: true, description: 'Test the implemented design to verify it meets requirements and quality standards.', hasArrowAfter: true },
  { id: '35', name: 'Crit Review', shortEstimate: 1, longEstimate: 2, phase: 'Deliver', visible: true, description: 'A structured feedback session to analyze and improve the work by focusing on objectives, asking questions, identifying problems, and offering solutions collaboratively.', hasArrowAfter: true },
  { id: '36', name: 'Leadership Review', shortEstimate: 1, longEstimate: 2, phase: 'Deliver', visible: true, description: 'Present findings and recommendations to leadership for alignment, feedback, and approval to proceed to the next phase.', hasArrowAfter: true },
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
  { id: 'Discovery', name: 'Discovery', visible: true, color: colorOptions[0] },
  { id: 'Define', name: 'Define', visible: true, color: colorOptions[1] },
  { id: 'Concept', name: 'Concept', visible: true, color: colorOptions[2] },
  { id: 'Design', name: 'Design', visible: true, color: colorOptions[3] },
  { id: 'Deliver', name: 'Deliver', visible: true, color: colorOptions[4] },
];

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
          className={`border-2 ${task.visible ? phaseColor.border : 'border-gray-300'} ${task.visible ? phaseColor.bg : 'bg-gray-100'} p-4 min-w-[240px] relative cursor-pointer transition-all ${isExpanded ? 'min-h-[200px]' : ''}`}
          id={`task-${task.id}`}
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
      
      {/* Tasks */}
      {phase.visible && (
        <div className="flex-1 p-6 pl-14 space-y-4">
          {phaseTasks.map((task, taskIndex) => (
            <TaskCard
              key={task.id}
              task={task}
              index={taskIndex}
              phase={phase.id}
              phaseColor={phase.color}
              updateEstimate={updateEstimate}
              toggleVisibility={toggleVisibility}
              moveTask={moveTask}
              isLastInPhase={taskIndex === phaseTasks.length - 1}
              isExpanded={expandedTaskId === task.id}
              onToggleExpanded={toggleExpanded}
              onUpdateDescription={updateDescription}
              onToggleArrow={toggleArrow}
            />
          ))}
          
          {/* Add Task Button */}
          <button
            onClick={() => addTask(phase.id)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800"
            title="Add new task"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showPhaseBreakdown, setShowPhaseBreakdown] = useState(false);

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
          <div className="mb-2">
            <h1 className="text-3xl">Design Process Flow</h1>
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

            {/* Phase Breakdown */}
            {showPhaseBreakdown && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Phase Duration Breakdown</h3>
                <div className="space-y-3">
                  {phases.filter(p => p.visible).map(phase => {
                    const shortEstimate = getPhaseEstimate(phase.id, 'short');
                    const longEstimate = getPhaseEstimate(phase.id, 'long');
                    
                    return (
                      <div key={phase.id} className={`p-4 ${phase.color.bg} border ${phase.color.border} rounded`}>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900">{phase.name}</div>
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-green-50 border border-gray-300 rounded"></div>
              <span>Shortest estimate (days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-red-50 border border-gray-300 rounded"></div>
              <span>Longest estimate (days)</span>
            </div>
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span>Drag to reorder</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span>Toggle visibility</span>
            </div>
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
        </div>
      </div>
    </DndProvider>
  );
}