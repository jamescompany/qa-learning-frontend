import { create } from 'zustand';
import { useAuthStore } from './authStore';
import kanbanService, { KanbanBoard, KanbanColumn, KanbanCard } from '../services/kanban.service';

interface KanbanStore {
  boards: KanbanBoard[];
  currentBoard: KanbanBoard | null;
  isLoading: boolean;
  error: string | null;
  
  // Board operations
  fetchBoards: () => Promise<void>;
  fetchBoard: (id: string) => Promise<void>;
  createBoard: (title: string, description?: string) => Promise<KanbanBoard>;
  updateBoard: (id: string, updates: { title?: string; description?: string }) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  
  // Column operations
  createColumn: (boardId: string, title: string, position?: number) => Promise<any>;
  updateColumn: (id: string, updates: { title?: string; position?: number }) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  
  // Card operations
  createCard: (columnId: string, card: {
    title: string;
    description?: string;
    assignee?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
  }) => Promise<void>;
  updateCard: (id: string, updates: Partial<KanbanCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (cardId: string, targetColumnId: string, position?: number) => Promise<void>;
  
  // Helper methods
  getColumnById: (columnId: string) => KanbanColumn | undefined;
  getCardById: (cardId: string) => KanbanCard | undefined;
  clearError: () => void;
}

export const useKanbanStore = create<KanbanStore>()(
  (set, get) => ({
    boards: [],
    currentBoard: null,
    isLoading: false,
    error: null,
    
    // Board operations
    fetchBoards: async () => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ isLoading: true, error: null });
      try {
        const response = await kanbanService.getBoards();
        set({ boards: response.boards, isLoading: false });
      } catch (error: any) {
        console.error('Failed to fetch boards:', error);
        set({ error: error.message || 'Failed to fetch boards', isLoading: false });
      }
    },
    
    fetchBoard: async (id) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ isLoading: true, error: null });
      try {
        const board = await kanbanService.getBoard(id);
        
        // Translate column titles if they're in English (for mock data compatibility)
        const englishToTranslationKey = {
          'todo': 'todo',
          'To Do': 'todo',
          'inProgress': 'inProgress',
          'In Progress': 'inProgress',
          'review': 'review',
          'Review': 'review',
          'done': 'done',
          'Done': 'done'
        };
        
        // Apply translations based on current locale
        if (board.columns) {
          board.columns = board.columns.map(column => {
            const translationKey = englishToTranslationKey[column.title];
            if (translationKey) {
              // Store the translation key for consistent mapping
              return {
                ...column,
                title: column.title, // Keep original for now, translate in component
                translationKey // Add translation key for reference
              };
            }
            return column;
          });
        }
        
        set({ currentBoard: board, isLoading: false });
        
        // Also update the board in the boards list
        set((state) => ({
          boards: state.boards.map((b) => (b.id === id ? board : b)),
        }));
      } catch (error: any) {
        console.error('Failed to fetch board:', error);
        set({ error: error.message || 'Failed to fetch board', isLoading: false });
      }
    },
    
    createBoard: async (title, description) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      set({ error: null });
      try {
        const newBoard = await kanbanService.createBoard({ title, description });
        
        set((state) => ({
          boards: [...state.boards, newBoard],
        }));
        
        return newBoard;
      } catch (error: any) {
        console.error('Failed to create board:', error);
        set({ error: error.message || 'Failed to create board' });
        throw error;
      }
    },
    
    updateBoard: async (id, updates) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        const updatedBoard = await kanbanService.updateBoard(id, updates);
        
        set((state) => ({
          boards: state.boards.map((board) => (board.id === id ? updatedBoard : board)),
          currentBoard: state.currentBoard?.id === id ? updatedBoard : state.currentBoard,
        }));
      } catch (error: any) {
        console.error('Failed to update board:', error);
        set({ error: error.message || 'Failed to update board' });
        throw error;
      }
    },
    
    deleteBoard: async (id) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.deleteBoard(id);
        
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
        }));
      } catch (error: any) {
        console.error('Failed to delete board:', error);
        set({ error: error.message || 'Failed to delete board' });
        throw error;
      }
    },
    
    // Column operations
    createColumn: async (boardId, title, position) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        const newColumn = await kanbanService.createColumn(boardId, { title, position });
        
        // Don't auto-refresh - let the caller decide when to refresh
        // This prevents multiple refreshes when creating multiple columns
        return newColumn;
      } catch (error: any) {
        console.error('Failed to create column:', error);
        set({ error: error.message || 'Failed to create column' });
        throw error;
      }
    },
    
    updateColumn: async (id, updates) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.updateColumn(id, updates);
        
        // Refresh the current board to get updated columns
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to update column:', error);
        set({ error: error.message || 'Failed to update column' });
        throw error;
      }
    },
    
    deleteColumn: async (id) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.deleteColumn(id);
        
        // Refresh the current board to get updated columns
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to delete column:', error);
        set({ error: error.message || 'Failed to delete column' });
        throw error;
      }
    },
    
    // Card operations
    createCard: async (columnId, card) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.createCard(columnId, card);
        
        // Refresh the current board to get updated cards
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to create card:', error);
        set({ error: error.message || 'Failed to create card' });
        throw error;
      }
    },
    
    updateCard: async (id, updates) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.updateCard(id, updates);
        
        // Refresh the current board to get updated cards
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to update card:', error);
        set({ error: error.message || 'Failed to update card' });
        throw error;
      }
    },
    
    deleteCard: async (id) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.deleteCard(id);
        
        // Refresh the current board to get updated cards
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to delete card:', error);
        set({ error: error.message || 'Failed to delete card' });
        throw error;
      }
    },
    
    moveCard: async (cardId, targetColumnId, position) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ error: null });
      try {
        await kanbanService.moveCard(cardId, targetColumnId, position);
        
        // Refresh the current board to get updated cards
        const currentBoard = get().currentBoard;
        if (currentBoard) {
          await get().fetchBoard(currentBoard.id);
        }
      } catch (error: any) {
        console.error('Failed to move card:', error);
        set({ error: error.message || 'Failed to move card' });
        throw error;
      }
    },
    
    // Helper methods
    getColumnById: (columnId) => {
      const currentBoard = get().currentBoard;
      if (!currentBoard) return undefined;
      
      return currentBoard.columns.find((col) => col.id === columnId);
    },
    
    getCardById: (cardId) => {
      const currentBoard = get().currentBoard;
      if (!currentBoard) return undefined;
      
      for (const column of currentBoard.columns) {
        const card = column.cards.find((c) => c.id === cardId);
        if (card) return card;
      }
      
      return undefined;
    },
    
    clearError: () => set({ error: null }),
  })
);