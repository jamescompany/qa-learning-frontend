import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TodoForm from '../components/forms/TodoForm';
import Loading from '../components/common/Loading';
import { useTodoStore } from '../store/todoStore';

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TodoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStore();
  const [isLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    // Check if we should open the form automatically
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      // Remove the parameter from URL after opening
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
      });
    } else {
      addTodo(data.title, data.description);
    }
    setShowForm(false);
    setEditingTodoId(null);
  };


  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" text="Loading todos..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Todo
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {(['all', 'active', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`pb-2 px-1 font-medium capitalize transition-colors ${
                filter === status
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
              <span className="ml-2 text-sm">
                ({todos.filter(todo => {
                  if (status === 'active') return !todo.completed;
                  if (status === 'completed') return todo.completed;
                  return true;
                }).length})
              </span>
            </button>
          ))}
        </div>

        {/* Todo Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                {editingTodo ? 'Edit Todo' : 'Create New Todo'}
              </h2>
              <TodoForm
                onSubmit={handleSubmit}
                initialData={editingTodo ? {
                  title: editingTodo.title,
                  description: editingTodo.description || '',
                  priority: 'medium' as const,
                  dueDate: ''
                } : undefined}
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

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No todos found</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-800"
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

export default TodoPage;