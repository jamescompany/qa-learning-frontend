import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useKanbanStore } from '../store/kanbanStore';
import authService from '../services/auth.service';
import { User } from '../types/user.types';
import { KanbanCard } from '../services/kanban.service';

const KanbanPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    currentBoard, 
    fetchBoards,
    fetchBoard,
    createBoard,
    createColumn,
    createCard: createCardStore, 
    deleteCard: deleteCardStore, 
    updateCard: updateCardStore, 
    moveCard: moveCardStore,
    isLoading,
    error 
  } = useKanbanStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'inProgress' | 'review' | 'done'>('todo');
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', assigneeId: '' });
  const [editingTask, setEditingTask] = useState<KanbanCard | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddForm) {
        setShowAddForm(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', priority: 'medium', assigneeId: '' });
      }
    };

    if (showAddForm) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showAddForm]);

  useEffect(() => {
    const initializeBoard = async () => {
      try {
        await fetchBoards();
        const boards = useKanbanStore.getState().boards;
        
        if (boards && boards.length > 0) {
          await fetchBoard(boards[0].id);
          
          // Check if all columns exist
          const board = useKanbanStore.getState().currentBoard;
          if (board) {
            const requiredColumns = ['todo', 'inProgress', 'review', 'done'];
            const existingColumnKeys = new Set();
            
            // Map existing columns to their keys
            const titleToKey = {
              'todo': 'todo',
              'To Do': 'todo',
              'inProgress': 'inProgress',
              'In Progress': 'inProgress',
              'review': 'review',
              'Review': 'review',
              'done': 'done',
              'Done': 'done',
              [t('kanban.columns.todo')]: 'todo',
              [t('kanban.columns.inProgress')]: 'inProgress',
              [t('kanban.columns.review')]: 'review',
              [t('kanban.columns.done')]: 'done'
            };
            
            board.columns.forEach(col => {
              const key = titleToKey[col.title];
              if (key) existingColumnKeys.add(key);
            });
            
            // Collect missing columns
            const missingColumns = [];
            let position = board.columns.length;
            for (const key of requiredColumns) {
              if (!existingColumnKeys.has(key)) {
                missingColumns.push({ key, position: position++ });
              }
            }
            
            // Create all missing columns in parallel
            if (missingColumns.length > 0) {
              await Promise.all(
                missingColumns.map(({ key, position }) => 
                  createColumn(board.id, t(`kanban.columns.${key}`), position)
                )
              );
              // Refresh board once after all columns are created
              await fetchBoard(board.id);
            }
          }
        } else {
          // Create new board with all columns at once
          const newBoard = await createBoard('My Kanban Board', 'Personal task management board');
          
          // Create all columns in parallel
          await Promise.all([
            createColumn(newBoard.id, t('kanban.columns.todo'), 0),
            createColumn(newBoard.id, t('kanban.columns.inProgress'), 1),
            createColumn(newBoard.id, t('kanban.columns.review'), 2),
            createColumn(newBoard.id, t('kanban.columns.done'), 3)
          ]);
          
          // Fetch board once after all columns are created
          await fetchBoard(newBoard.id);
        }
      } catch (error) {
        console.error('Failed to initialize board:', error);
      }
    };

    initializeBoard();
  }, [t]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await authService.getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

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

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (draggedTaskId && currentBoard) {
      const targetColumn = currentBoard.columns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        // Calculate the position as the number of cards in the target column
        const position = targetColumn.cards.length;
        await moveCardStore(draggedTaskId, targetColumn.id, position);
      }
      setDraggedTaskId(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    await deleteCardStore(taskId);
  };

  const addTask = async (taskData: any) => {
    if (!currentBoard) return;
    
    const columnTranslations = {
      'todo': t('kanban.columns.todo'),
      'inProgress': t('kanban.columns.inProgress'),
      'review': t('kanban.columns.review'),
      'done': t('kanban.columns.done')
    };
    
    const targetColumnTitle = columnTranslations[selectedColumn];
    const targetColumn = currentBoard.columns.find(col => col.title === targetColumnTitle);
    
    if (targetColumn) {
      await createCardStore(targetColumn.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignee: taskData.assigneeId || undefined
      });
    }
  };

  const updateTask = async (taskId: string, updates: any) => {
    const columnTranslations = {
      'todo': t('kanban.columns.todo'),
      'inProgress': t('kanban.columns.inProgress'),
      'review': t('kanban.columns.review'),
      'done': t('kanban.columns.done')
    };
    
    const targetColumnTitle = updates.status ? columnTranslations[updates.status] : undefined;
    const targetColumn = targetColumnTitle ? 
      currentBoard?.columns.find(col => col.title === targetColumnTitle) : undefined;
    
    await updateCardStore(taskId, {
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      assigneeId: updates.assigneeId || undefined,
      columnId: targetColumn?.id
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-50 dark:bg-gray-7000';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('kanban.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('kanban.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('kanban.addTask')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {currentBoard?.columns && currentBoard.columns.length > 0 ? (
            currentBoard.columns.map(column => {
            const columnTasks = column.cards || [];
            
            // Map English column titles to translation keys
            const titleToKey = {
              'todo': 'todo',
              'To Do': 'todo',
              'inProgress': 'inProgress',
              'In Progress': 'inProgress',
              'review': 'review',
              'Review': 'review',
              'done': 'done',
              'Done': 'done',
              // Also check for already translated titles
              [t('kanban.columns.todo')]: 'todo',
              [t('kanban.columns.inProgress')]: 'inProgress',
              [t('kanban.columns.review')]: 'review',
              [t('kanban.columns.done')]: 'done'
            };
            
            const columnKey = titleToKey[column.title] || 'todo';
            const displayTitle = t(`kanban.columns.${columnKey}`);
            const columnConfig = columns.find(c => c.id === columnKey) || columns[0];
            
            return (
              <div key={column.id} className="flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {displayTitle}
                  </h2>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('kanban.tasks', { count: columnTasks.length })}
                  </div>
                </div>
                
                <div
                  className={`flex-1 ${columnConfig.color} rounded-lg p-4 min-h-[400px] relative`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <button
                    onClick={() => {
                      setSelectedColumn(columnKey as 'todo' | 'inProgress' | 'review' | 'done');
                      setShowAddForm(true);
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
                    title={t('kanban.addToColumn')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div className="space-y-3">
                    {columnTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className={`rounded-lg shadow p-4 cursor-move hover:shadow-md transition-shadow group ${
                          columnKey === 'todo' ? 'bg-white dark:bg-gray-800 border-l-4 border-gray-500' :
                          columnKey === 'inProgress' || columnKey === 'review' ? 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500' :
                          'bg-green-50 dark:bg-green-950 border-l-4 border-green-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority || 'medium')}`}></div>
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                setFormData({
                                  title: task.title,
                                  description: task.description || '',
                                  priority: task.priority || 'medium',
                                  assigneeId: task.assigneeId || ''
                                });
                                setSelectedColumn(columnKey as 'todo' | 'inProgress' | 'review' | 'done');
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {t(`kanban.priority.${task.priority || 'medium'}`)}
                          </span>
                          {task.assignee && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{task.assignee.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {columns.map(col => (
                <div key={col.id} className="flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {col.title}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1">
                      {t('kanban.tasks', { count: 0 })}
                    </div>
                  </div>
                  <div className={`flex-1 ${col.color} rounded-lg p-4 min-h-[400px]`}>
                    <div className="text-gray-500 text-center mt-8">
                      {t('kanban.noTasks', { defaultValue: 'No tasks yet' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      
      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{editingTask ? t('kanban.form.editTitle') : t('kanban.form.title')}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (editingTask) {
                  await updateTask(editingTask.id, {
                    title: formData.title,
                    description: formData.description,
                    status: selectedColumn,
                    priority: formData.priority as 'low' | 'medium' | 'high',
                    assigneeId: formData.assigneeId,
                  });
                } else {
                  await addTask({
                    title: formData.title,
                    description: formData.description,
                    status: selectedColumn,
                    priority: formData.priority as 'low' | 'medium' | 'high',
                    assigneeId: formData.assigneeId,
                  });
                }
                setShowAddForm(false);
                setEditingTask(null);
                setFormData({ title: '', description: '', priority: 'medium', assigneeId: '' });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('kanban.form.fields.title')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('kanban.form.fields.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('kanban.form.fields.priority')}
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{t('kanban.priority.low')}</option>
                    <option value="medium">{t('kanban.priority.medium')}</option>
                    <option value="high">{t('kanban.priority.high')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('kanban.form.fields.assignee')}
                  </label>
                  <select
                    name="assigneeId"
                    value={formData.assigneeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('kanban.form.fields.assigneeNone', { defaultValue: 'No assignee' })}</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username || user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('kanban.form.fields.column')}
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value as 'todo' | 'inProgress' | 'review' | 'done')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editingTask ? t('kanban.form.buttons.update') : t('kanban.form.buttons.add')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', priority: 'medium', assigneeId: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
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