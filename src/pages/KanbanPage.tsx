import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useKanbanStore } from '../store/kanbanStore';

const KanbanPage: React.FC = () => {
  const { t } = useTranslation();
  const { getUserTasks, moveTask, addTask, deleteTask, updateTask } = useKanbanStore();
  const tasks = getUserTasks(); // 현재 사용자의 작업만 가져오기
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'inProgress' | 'review' | 'done'>('todo');
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', assignee: '' });
  const [editingTask, setEditingTask] = useState<any>(null);

  const columns = [
    { id: 'todo', title: t('kanban.columns.todo'), color: 'bg-gray-100' },
    { id: 'inProgress', title: t('kanban.columns.inProgress'), color: 'bg-blue-50' },
    { id: 'review', title: t('kanban.columns.review'), color: 'bg-yellow-50' },
    { id: 'done', title: t('kanban.columns.done'), color: 'bg-green-50' },
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
            <h1 className="text-3xl font-bold text-gray-900">{t('kanban.title')}</h1>
            <p className="text-gray-600 mt-2">{t('kanban.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('kanban.addTask')}
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
                  {t('kanban.tasks', { count: tasks.filter(t => t.status === column.id).length })}
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
                  title={t('kanban.addToColumn')}
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
                              onClick={() => {
                                setEditingTask(task);
                                setFormData({
                                  title: task.title,
                                  description: task.description,
                                  priority: task.priority,
                                  assignee: task.assignee
                                });
                                setSelectedColumn(task.status);
                                setShowAddForm(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity"
                              title={t('kanban.editTask')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                              title={t('kanban.deleteTask')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{t('kanban.assignedTo', { assignee: task.assignee })}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {t(`kanban.priority.${task.priority}`)}
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
            <h2 className="text-xl font-semibold mb-4">{editingTask ? t('kanban.form.editTitle') : t('kanban.form.title')}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTask) {
                  updateTask(editingTask.id, {
                    title: formData.title,
                    description: formData.description,
                    status: selectedColumn,
                    priority: formData.priority as 'low' | 'medium' | 'high',
                    assignee: formData.assignee,
                  });
                } else {
                  addTask({
                    title: formData.title,
                    description: formData.description,
                    status: selectedColumn,
                    priority: formData.priority as 'low' | 'medium' | 'high',
                    assignee: formData.assignee,
                  });
                }
                setShowAddForm(false);
                setEditingTask(null);
                setFormData({ title: '', description: '', priority: 'medium', assignee: '' });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('kanban.form.fields.title')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('kanban.form.fields.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('kanban.form.fields.priority')}
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{t('kanban.priority.low')}</option>
                    <option value="medium">{t('kanban.priority.medium')}</option>
                    <option value="high">{t('kanban.priority.high')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('kanban.form.fields.assignee')}
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    required
                    placeholder={t('kanban.form.fields.assigneePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('kanban.form.fields.column')}
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value as 'todo' | 'inProgress' | 'review' | 'done')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">{t('kanban.columns.todo')}</option>
                    <option value="inProgress">{t('kanban.columns.inProgress')}</option>
                    <option value="review">{t('kanban.columns.review')}</option>
                    <option value="done">{t('kanban.columns.done')}</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={!formData.title.trim()}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    formData.title.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {editingTask ? t('kanban.form.buttons.update') : t('kanban.form.buttons.add')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', priority: 'medium', assignee: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {t('kanban.form.buttons.cancel')}
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