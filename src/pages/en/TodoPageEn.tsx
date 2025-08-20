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

const TodoPageEn: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getUserTodos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStore();
  const todos = getUserTodos(); // Get only current user's todos
  const [isLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const editingTodo = todos.find(t => t.id === editingTodoId) || null;

  const handleSubmit = (data: TodoFormData) => {
    if (editingTodoId) {
      updateTodo(editingTodoId, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
      });
    } else {
      addTodo(data.title, data.description, data.priority, data.dueDate);
    }
    setShowForm(false);
    setEditingTodoId(null);
  };

  const handleEdit = (id: string) => {
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
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            data-testid="add-todo-button"
          >
            Add New Todo
          </button>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="filter-all"
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="filter-active"
          >
            Active ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="filter-completed"
          >
            Completed ({todos.filter(t => t.completed).length})
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                {editingTodoId ? 'Edit Todo' : 'New Todo'}
              </h2>
              <TodoForm
                initialData={editingTodo ? {
                  title: editingTodo.title,
                  description: editingTodo.description || '',
                  priority: editingTodo.priority,
                  dueDate: editingTodo.dueDate,
                } : undefined}
                onSubmit={handleSubmit}
              />
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTodoId(null);
                }}
                className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No todos found</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow p-4 transition-all ${
                  deletingTodoId === todo.id ? 'opacity-50 scale-95' : ''
                }`}
                data-testid={`todo-item-${todo.id}`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mt-1 h-5 w-5 text-blue-600 rounded"
                    data-testid={`todo-checkbox-${todo.id}`}
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`mt-1 text-sm ${
                        todo.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className="text-gray-500">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(todo.id)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`todo-edit-${todo.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`todo-delete-${todo.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TodoPageEn;