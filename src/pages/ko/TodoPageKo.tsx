import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TodoForm from '../../components/forms/TodoForm';
import Loading from '../../components/common/Loading';
import { useTodoStore } from '../../store/todoStore';

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TodoPageKo: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getUserTodos, addTodo, toggleTodo, deleteTodo, updateTodo, fetchTodos, isLoading } = useTodoStore();
  const todos = getUserTodos(); // 현재 사용자의 todos만 가져오기
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const editingTodo = todos.find(t => t.id === editingTodoId) || null;

  const handleSubmit = (data: TodoFormData) => {
    console.log('TodoPage handleSubmit data:', data);
    if (editingTodoId) {
      console.log('Updating todo with dueDate:', data.dueDate);
      updateTodo(editingTodoId, {
        title: data.title,
        description: data.description,
        priority: (data.priority as any),
        dueDate: data.dueDate,
      } as any);
    } else {
      console.log('Creating todo with dueDate:', data.dueDate);
      addTodo(data.title, data.description, data.priority, data.dueDate);
    }
    setShowForm(false);
    setEditingTodoId(null);
  };

  const handleEdit = (id: string) => {
    const todoToEdit = todos.find(t => t.id === id);
    console.log('Editing todo:', todoToEdit);
    console.log('Due date:', todoToEdit?.dueDate);
    setEditingTodoId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingTodoId(id);
    await new Promise(resolve => setTimeout(resolve, 300));
    deleteTodo(id);
    setDeletingTodoId(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'incomplete') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' shows everything
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
      default: return priority;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const getDaysRemaining = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDayLabel = (dueDate?: string) => {
    const days = getDaysRemaining(dueDate);
    if (days === null) return '';
    if (days < 0) return ' (기한 초과)';
    if (days === 0) return ' (D-Day)';
    return ` (D-${days})`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">할 일 목록</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            data-testid="add-todo-button"
          >
            새 할 일 추가
          </button>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            data-testid="filter-all"
          >
            전체 ({todos.length})
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'incomplete' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            data-testid="filter-incomplete"
          >
            미완료 ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            data-testid="filter-completed"
          >
            완료 ({todos.filter(t => t.completed).length})
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                {editingTodoId ? '할 일 수정' : '새 할 일'}
              </h2>
              <TodoForm
                initialData={editingTodo ? {
                  title: editingTodo.title,
                  description: editingTodo.description || '',
                  priority: (editingTodo.priority as any) as 'low' | 'medium' | 'high',
                  dueDate: editingTodo.dueDate,
                } : undefined}
                onSubmit={handleSubmit}
              />
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTodoId(null);
                }}
                className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">할 일이 없습니다</p>
            </div>
          ) : (
            filteredTodos.map(todo => {
              console.log('Rendering todo:', todo);
              return (
              <div
                key={todo.id}
                className={`rounded-lg shadow p-4 transition-all ${
                  deletingTodoId === todo.id ? 'opacity-50 scale-95' : ''
                } ${
                  isOverdue(todo.dueDate) && !todo.completed
                    ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 animate-pulse-slow'
                    : getDaysRemaining(todo.dueDate) === 0 && !todo.completed
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700'
                    : getDaysRemaining(todo.dueDate) !== null && getDaysRemaining(todo.dueDate)! <= 3 && !todo.completed
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-white dark:bg-gray-800'
                }`}
                data-testid={`todo-item-${todo.id}`}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`mt-1 text-sm ${
                        todo.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                        {getPriorityLabel(todo.priority)}
                      </span>
                      {todo.dueDate && !todo.completed && (
                        <span className={`font-bold ${
                          isOverdue(todo.dueDate)
                            ? 'text-red-600 dark:text-red-400'
                            : getDaysRemaining(todo.dueDate) === 0
                            ? 'text-orange-600 dark:text-orange-400'
                            : getDaysRemaining(todo.dueDate)! <= 3
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {getDayLabel(todo.dueDate).trim()}
                        </span>
                      )}
                      {todo.dueDate && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(todo.dueDate).toISOString().split('T')[0]}
                          </span>
                        </div>
                      )}
                      {todo.completed && todo.completedAt && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-600 dark:text-green-400">
                            완료: {new Date(todo.completedAt).toISOString().split('T')[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!todo.completed && (
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        data-testid={`todo-complete-${todo.id}`}
                      >
                        완료
                      </button>
                    )}
                    {todo.completed && (
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        data-testid={`todo-uncomplete-${todo.id}`}
                      >
                        재시작
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(todo.id)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`todo-edit-${todo.id}`}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`todo-delete-${todo.id}`}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TodoPageKo;