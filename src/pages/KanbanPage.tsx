import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Write test cases', description: 'Create test cases for login flow', status: 'todo', priority: 'high', assignee: 'John' },
    { id: '2', title: 'API testing', description: 'Test REST endpoints', status: 'inProgress', priority: 'medium', assignee: 'Jane' },
    { id: '3', title: 'Review automation scripts', description: 'Code review for Selenium tests', status: 'review', priority: 'medium', assignee: 'Mike' },
    { id: '4', title: 'Deploy to staging', description: 'Deploy tested features', status: 'done', priority: 'low', assignee: 'Sarah' },
  ]);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'review', title: 'Review', color: 'bg-yellow-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status } : task
      ));
      setDraggedTask(null);
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-2">Drag and drop tasks to update their status</p>
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
                className={`flex-1 ${column.color} rounded-lg p-4 min-h-[400px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              >
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.status === column.id)
                    .map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg shadow p-4 cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
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
    </div>
  );
};

export default KanbanPage;