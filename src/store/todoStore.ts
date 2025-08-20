import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface Todo {
  id: string;
  userId: string; // 사용자별 구분을 위한 필드 추가
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
  getUserTodos: () => Todo[]; // 현재 사용자의 todos만 반환
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      
      addTodo: (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newTodo: Todo = {
          id: Date.now().toString(),
          userId: user.id,
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
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id && todo.userId === user.id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      deleteTodo: (id: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          todos: state.todos.filter((todo) => !(todo.id === id && todo.userId === user.id)),
        }));
      },
      
      updateTodo: (id: string, updates: Partial<Todo>) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id && todo.userId === user.id
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      getTodoStats: () => {
        const user = useAuthStore.getState().user;
        if (!user) return { total: 0, completed: 0 };
        
        const userTodos = get().todos.filter(todo => todo.userId === user.id);
        return {
          total: userTodos.length,
          completed: userTodos.filter((todo) => todo.completed).length,
        };
      },
      
      getUserTodos: () => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().todos.filter(todo => todo.userId === user.id);
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);