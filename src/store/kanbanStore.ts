import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface KanbanTask {
  id: string;
  userId: string; // 사용자별 구분을 위한 필드 추가
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KanbanStore {
  tasks: KanbanTask[];
  addTask: (task: Omit<KanbanTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<KanbanTask>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: KanbanTask['status']) => void;
  getTasksByStatus: (status: KanbanTask['status']) => KanbanTask[];
  getUserTasks: () => KanbanTask[]; // 현재 사용자의 작업만 반환
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newTask: KanbanTask = {
          ...task,
          id: Date.now().toString(),
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, updates) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id && task.userId === user.id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          tasks: state.tasks.filter((task) => 
            !(task.id === id && task.userId === user.id)
          ),
        }));
      },
      
      moveTask: (taskId, newStatus) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId && task.userId === user.id
              ? { ...task, status: newStatus, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      getTasksByStatus: (status) => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().tasks.filter(
          (task) => task.status === status && task.userId === user.id
        );
      },
      
      getUserTasks: () => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().tasks.filter(task => task.userId === user.id);
      },
    }),
    {
      name: 'kanban-storage',
    }
  )
);