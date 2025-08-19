import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useKanbanStore } from '../store/kanbanStore';

const KanbanPage: React.FC = () => {
  const { tasks, moveTask, addTask, deleteTask } = useKanbanStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'inProgress' | 'review' | 'done'>('todo');

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'review', title: 'Review', color: 'bg-yellow-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
  ];

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'inProgress' | 'review' | 'done') => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-gray-600 mt-2">Drag and drop tasks to update their status</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {column.title}
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  {tasks.filter(t => t.status === column.id).length} tasks
                </div>
              </div>
              
              <div
                className={`flex-1 ${column.color} rounded-lg p-4 min-h-[400px] relative`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as 'todo' | 'inProgress' | 'review' | 'done')}
              >
                <button
                  onClick={() => {
                    setSelectedColumn(column.id as 'todo' | 'inProgress' | 'review' | 'done');
                    setShowAddForm(true);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  title="Add task to this column"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.status === column.id)
                    .map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className="bg-white rounded-lg shadow p-4 cursor-move hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                              title="Delete task"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Assigned to: {task.assignee}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addTask({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  status: selectedColumn,
                  priority: formData.get('priority') as 'low' | 'medium' | 'high',
                  assignee: formData.get('assignee') as string,
                });
                setShowAddForm(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    required
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Column
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value as 'todo' | 'inProgress' | 'review' | 'done')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default KanbanPage;