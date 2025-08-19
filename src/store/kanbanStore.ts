import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KanbanTask {
  id: string;
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
  addTask: (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<KanbanTask>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: KanbanTask['status']) => void;
  getTasksByStatus: (status: KanbanTask['status']) => KanbanTask[];
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      tasks: [
        { 
          id: '1', 
          title: 'Write test cases', 
          description: 'Create test cases for login flow', 
          status: 'todo', 
          priority: 'high', 
          assignee: 'John',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        { 
          id: '2', 
          title: 'API testing', 
          description: 'Test REST endpoints', 
          status: 'inProgress', 
          priority: 'medium', 
          assignee: 'Jane',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02')
        },
        { 
          id: '3', 
          title: 'Review automation scripts', 
          description: 'Code review for Selenium tests', 
          status: 'review', 
          priority: 'medium', 
          assignee: 'Mike',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03')
        },
        { 
          id: '4', 
          title: 'Deploy to staging', 
          description: 'Deploy tested features', 
          status: 'done', 
          priority: 'low', 
          assignee: 'Sarah',
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date('2024-01-04')
        },
      ],
      
      addTask: (task) => {
        const newTask: KanbanTask = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      moveTask: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },
    }),
    {
      name: 'kanban-storage',
    }
  )
);