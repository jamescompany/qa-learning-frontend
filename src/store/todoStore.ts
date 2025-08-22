import { create } from 'zustand';
import { useAuthStore } from './authStore';
import todoService from '../services/todo.service';
import { Todo } from '../types/todo.types';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  getTodoStats: () => { total: number; completed: number };
  getUserTodos: () => Todo[]; // 현재 사용자의 todos만 반환
}

export const useTodoStore = create<TodoStore>()(
  (set, get) => ({
      todos: [],
      isLoading: false,
      error: null,
      
      fetchTodos: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          const response = await todoService.getTodos();
          console.log('TodoStore fetchTodos response:', response.todos);
          set({ todos: response.todos, isLoading: false });
        } catch (error: any) {
          console.error('Failed to fetch todos:', error);
          set({ error: error.message || 'Failed to fetch todos', isLoading: false });
        }
      },
      
      addTodo: async (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        console.log('TodoStore addTodo called with dueDate:', dueDate);
        set({ error: null });
        try {
          const newTodo = await todoService.createTodo({
            title,
            description,
            priority,
            dueDate,
          });
          console.log('TodoStore received newTodo:', newTodo);
          
          set((state) => ({
            todos: [...state.todos, newTodo],
          }));
        } catch (error: any) {
          console.error('Failed to create todo:', error);
          set({ error: error.message || 'Failed to create todo' });
          throw error;
        }
      },
      
      toggleTodo: async (id: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          const updatedTodo = await todoService.toggleTodo(id);
          
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? updatedTodo : todo
            ),
          }));
        } catch (error: any) {
          console.error('Failed to toggle todo:', error);
          set({ error: error.message || 'Failed to toggle todo' });
          throw error;
        }
      },
      
      deleteTodo: async (id: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          await todoService.deleteTodo(id);
          
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }));
        } catch (error: any) {
          console.error('Failed to delete todo:', error);
          set({ error: error.message || 'Failed to delete todo' });
          throw error;
        }
      },
      
      updateTodo: async (id: string, updates: Partial<Todo>) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          const updateData: any = {
            ...updates,
            priority: updates.priority as any,
          };
          const updatedTodo = await todoService.updateTodo(id, updateData);
          
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? updatedTodo : todo
            ),
          }));
        } catch (error: any) {
          console.error('Failed to update todo:', error);
          set({ error: error.message || 'Failed to update todo' });
          throw error;
        }
      },
      
      getTodoStats: () => {
        const todos = get().todos;
        return {
          total: todos.length,
          completed: todos.filter((todo) => todo.completed).length,
        };
      },
      
      getUserTodos: () => {
        // 백엔드 API는 이미 현재 사용자의 todos만 반환하므로 필터링 불필요
        return get().todos;
      },
    })
);