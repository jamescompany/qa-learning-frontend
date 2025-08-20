import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  getTodoStats: () => { total: number; completed: number };
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      
      addTodo: (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: string) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          title,
          description,
          priority,
          dueDate,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },
      
      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      
      updateTodo: (id: string, updates: Partial<Todo>) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      getTodoStats: () => {
        const state = get();
        return {
          total: state.todos.length,
          completed: state.todos.filter((todo) => todo.completed).length,
        };
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);