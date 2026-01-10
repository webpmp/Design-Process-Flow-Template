import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Eye, EyeOff, GripVertical } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  shortEstimate: number;
  longEstimate: number;
  phase: string;
  visible: boolean;
  description: string;
}

const initialTasks: Task[] = [
  // Discovery Phase
  { id: '1', name: 'Competitive Analysis', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Evaluate competitor products and services to identify strengths, weaknesses, and market opportunities.' },
  { id: '2', name: 'User Interviews', shortEstimate: 3, longEstimate: 7, phase: 'Discovery', visible: true, description: 'Conduct one-on-one interviews with target users to understand their needs, behaviors, and pain points.' },
  { id: '3', name: 'Stakeholder Interviews', shortEstimate: 2, longEstimate: 4, phase: 'Discovery', visible: true, description: 'Meet with key stakeholders to align on business goals, constraints, and success metrics.' },
  { id: '4', name: 'Contextual Inquiry', shortEstimate: 2, longEstimate: 5, phase: 'Discovery', visible: true, description: 'Observe users in their natural environment to understand workflow and context of use.' },
  { id: '5', name: 'Market Research', shortEstimate: 3, longEstimate: 6, phase: 'Discovery', visible: true, description: 'Analyze market trends, user demographics, and industry standards to inform design decisions.' },
  { id: '6', name: 'Analytics Review', shortEstimate: 1, longEstimate: 3, phase: 'Discovery', visible: true, description: 'Review existing analytics data to identify usage patterns, drop-off points, and areas for improvement.' },
  
  // Define Phase
  { id: '7', name: 'Synthesize User Research', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Analyze data from discovery phase (interviews, observations) to find patterns and insights.' },
  { id: '8', name: 'Create User Personas', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Develop fictional characters that represent key user segments with their goals and behaviors.' },
  { id: '9', name: 'Map User Journeys', shortEstimate: 2, longEstimate: 5, phase: 'Define', visible: true, description: 'Document the end-to-end experience of users interacting with the product or service.' },
  { id: '10', name: 'Formulate Problem Statements', shortEstimate: 1, longEstimate: 3, phase: 'Define', visible: true, description: 'Define clear, actionable problem statements that frame the design challenge.' },
  { id: '11', name: 'Define Objectives & Scope', shortEstimate: 1, longEstimate: 2, phase: 'Define', visible: true, description: 'Establish project goals, success criteria, and boundaries for the design effort.' },
  { id: '12', name: 'Conduct Task Analysis', shortEstimate: 2, longEstimate: 4, phase: 'Define', visible: true, description: 'Break down user tasks into detailed steps to understand complexity and requirements.' },
  
  // Concept Phase
  { id: '13', name: 'User Stories', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Write user stories in the format "As a [user], I want to [action] so that [benefit]".' },
  { id: '14', name: 'Sketching & Brainstorming', shortEstimate: 2, longEstimate: 5, phase: 'Concept', visible: true, description: 'Generate multiple design concepts through rapid sketching and ideation sessions.' },
  { id: '15', name: 'Affinity Diagramming', shortEstimate: 1, longEstimate: 3, phase: 'Concept', visible: true, description: 'Organize ideas and insights into related groups to identify themes and priorities.' },
  { id: '16', name: 'Story Mapping & Task Flows', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create visual representations of user flows showing how users move through tasks.' },
  { id: '17', name: 'Low-Fidelity Wireframing', shortEstimate: 3, longEstimate: 6, phase: 'Concept', visible: true, description: 'Develop basic wireframes to explore layout and information architecture concepts.' },
  { id: '18', name: 'Paper Prototyping', shortEstimate: 2, longEstimate: 4, phase: 'Concept', visible: true, description: 'Create quick, low-cost prototypes on paper to test concepts with users early.' },
  
  // Design Phase
  { id: '19', name: 'Wireframing', shortEstimate: 3, longEstimate: 7, phase: 'Design', visible: true, description: 'Create detailed wireframes that define layout, content hierarchy, and interactions.' },
  { id: '20', name: 'UI/Visual Design', shortEstimate: 5, longEstimate: 10, phase: 'Design', visible: true, description: 'Apply visual design including typography, color, imagery, and branding elements.' },
  { id: '21', name: 'Interactive Prototyping', shortEstimate: 3, longEstimate: 6, phase: 'Design', visible: true, description: 'Build clickable prototypes that simulate the user experience for testing and validation.' },
  { id: '22', name: 'UX Writing', shortEstimate: 2, longEstimate: 4, phase: 'Design', visible: true, description: 'Craft clear, concise microcopy for UI elements, error messages, and help text.' },
  
  // Deliver Phase
  { id: '23', name: 'Design Documentation', shortEstimate: 2, longEstimate: 5, phase: 'Deliver', visible: true, description: 'Create comprehensive documentation including design specifications and guidelines.' },
  { id: '24', name: 'Developer Handoff/Review', shortEstimate: 2, longEstimate: 4, phase: 'Deliver', visible: true, description: 'Collaborate with developers to ensure accurate implementation of designs.' },
  { id: '25', name: 'QA', shortEstimate: 3, longEstimate: 6, phase: 'Deliver', visible: true, description: 'Test the implemented design to verify it meets requirements and quality standards.' },
];

const phaseColors = {
  Discovery: { bg: 'bg-purple-100', border: 'border-purple-300', header: 'bg-purple-600' },
  Define: { bg: 'bg-blue-100', border: 'border-blue-300', header: 'bg-blue-600' },
  Concept: { bg: 'bg-green-100', border: 'border-green-300', header: 'bg-green-600' },
  Design: { bg: 'bg-orange-100', border: 'border-orange-300', header: 'bg-orange-600' },
  Deliver: { bg: 'bg-pink-100', border: 'border-pink-300', header: 'bg-pink-600' },
};

interface TaskCardProps {
  task: Task;
  index: number;
  phase: string;
  updateEstimate: (id: string, type: 'short' | 'long', value: string) => void;
  toggleVisibility: (id: string) => void;
  moveTask: (dragIndex: number, hoverIndex: number, phase: string) => void;
  isLastInPhase: boolean;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
}

const TaskCard = ({ 
  task, 
  index, 
  phase, 
  updateEstimate, 
  toggleVisibility, 
  moveTask, 
  isLastInPhase,
  isExpanded,
  onToggleExpanded,
  onUpdateDescription,
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

  const phaseColor = phaseColors[phase as keyof typeof phaseColors];
  
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
          <div className="flex justify-center py-2 relative">
            <div className="w-0.5 h-4 bg-gray-800"></div>
            <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800" style={{ top: '16px' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const phases = ['Discovery', 'Define', 'Concept', 'Design', 'Deliver'];

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

  const moveTask = (dragIndex: number, hoverIndex: number, phase: string) => {
    const phaseTasks = tasks.filter(task => task.phase === phase);
    const otherTasks = tasks.filter(task => task.phase !== phase);
    
    const dragTask = phaseTasks[dragIndex];
    const newPhaseTasks = [...phaseTasks];
    newPhaseTasks.splice(dragIndex, 1);
    newPhaseTasks.splice(hoverIndex, 0, dragTask);
    
    // Reconstruct the full tasks array maintaining the order of phases
    const newTasks: Task[] = [];
    phases.forEach(p => {
      if (p === phase) {
        newTasks.push(...newPhaseTasks);
      } else {
        newTasks.push(...otherTasks.filter(t => t.phase === p));
      }
    });
    
    setTasks(newTasks);
  };

  const getTotalShort = () => tasks.filter(t => t.visible).reduce((sum, task) => sum + task.shortEstimate, 0);
  const getTotalLong = () => tasks.filter(t => t.visible).reduce((sum, task) => sum + task.longEstimate, 0);

  const formatDuration = (days: number) => {
    const weeks = (days / 5).toFixed(1);
    const months = (days / 20).toFixed(1);
    return { days, weeks, months };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl">Design Process Flow</h1>
          </div>
          
          {/* Flow Diagram */}
          <div className="overflow-x-auto pb-8">
            <div className="inline-flex gap-0 border border-gray-300 bg-white">
              {phases.map((phase, phaseIndex) => {
                const phaseTasks = tasks.filter(task => task.phase === phase);
                const phaseColor = phaseColors[phase as keyof typeof phaseColors];
                
                return (
                  <div key={phase} className="flex flex-col border-r border-gray-300 last:border-r-0">
                    {/* Phase Header */}
                    <div className={`${phaseColor.header} text-white px-6 py-4 text-center font-semibold min-w-[280px]`}>
                      {phase}
                    </div>
                    
                    {/* Tasks */}
                    <div className="flex-1 p-6 pl-14 space-y-4">
                      {phaseTasks.map((task, taskIndex) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={taskIndex}
                          phase={phase}
                          updateEstimate={updateEstimate}
                          toggleVisibility={toggleVisibility}
                          moveTask={moveTask}
                          isLastInPhase={taskIndex === phaseTasks.length - 1}
                          isExpanded={expandedTaskId === task.id}
                          onToggleExpanded={toggleExpanded}
                          onUpdateDescription={updateDescription}
                        />
                      ))}
                    </div>
                    
                    {/* Arrow to next phase */}
                    {phaseIndex < phases.length - 1 && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-[1px] z-10">
                        <div className="flex items-center">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Totals Summary */}
          <div className="mt-12 bg-white border-2 border-gray-800 p-8 max-w-2xl">
            <h2 className="text-2xl mb-6">Project Duration Estimates</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-600 rounded">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Best Case Scenario (Shortest Estimates)</div>
                  <div className="text-3xl font-semibold text-green-700">{getTotalShort()} days</div>
                  <div className="text-sm text-green-600 mt-1">
                    {formatDuration(getTotalShort()).weeks} weeks • {formatDuration(getTotalShort()).months} months
                  </div>
                </div>
                <div className="text-green-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-600 rounded">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Worst Case Scenario (Longest Estimates)</div>
                  <div className="text-3xl font-semibold text-red-700">{getTotalLong()} days</div>
                  <div className="text-sm text-red-600 mt-1">
                    {formatDuration(getTotalLong()).weeks} weeks • {formatDuration(getTotalLong()).months} months
                  </div>
                </div>
                <div className="text-red-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-600 rounded">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Estimated Range</div>
                  <div className="text-3xl font-semibold text-blue-700">
                    {getTotalShort()} - {getTotalLong()} days
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {formatDuration(getTotalShort()).weeks} - {formatDuration(getTotalLong()).weeks} weeks • {formatDuration(getTotalShort()).months} - {formatDuration(getTotalLong()).months} months
                  </div>
                </div>
                <div className="text-blue-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> These estimates represent the total time across all phases of the design process. 
                Actual duration may vary based on project complexity, team size, and stakeholder availability.
                Week calculations assume 5 working days per week. Month calculations assume 20 working days per month.
              </p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Excluded from totals</span>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}