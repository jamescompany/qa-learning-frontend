import api from './api';

export interface KanbanAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: KanbanAssignee;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  attachments?: string[];
  position: number;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
  cards: KanbanCard[];
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateBoardData {
  title: string;
  description?: string;
}

interface UpdateBoardData extends Partial<CreateBoardData> {}

interface CreateColumnData {
  title: string;
  position?: number;
}

interface UpdateColumnData extends Partial<CreateColumnData> {}

interface CreateCardData {
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  position?: number;
}

interface UpdateCardData extends Partial<CreateCardData> {
  columnId?: string;
  assigneeId?: string;
}

interface BoardsResponse {
  boards: KanbanBoard[];
  total: number;
}

class KanbanService {
  // Board operations
  async getBoards(): Promise<BoardsResponse> {
    const response = await api.get<BoardsResponse>('/kanban/boards');
    return response.data;
  }

  async getBoard(id: string): Promise<KanbanBoard> {
    const response = await api.get<KanbanBoard>(`/kanban/boards/${id}`);
    return response.data;
  }

  async createBoard(data: CreateBoardData): Promise<KanbanBoard> {
    const response = await api.post<KanbanBoard>('/kanban/boards', data);
    return response.data;
  }

  async updateBoard(id: string, data: UpdateBoardData): Promise<KanbanBoard> {
    const response = await api.patch<KanbanBoard>(`/kanban/boards/${id}`, data);
    return response.data;
  }

  async deleteBoard(id: string): Promise<void> {
    await api.delete(`/kanban/boards/${id}`);
  }

  // Column operations
  async createColumn(boardId: string, data: CreateColumnData): Promise<KanbanColumn> {
    const response = await api.post<KanbanColumn>(`/kanban/boards/${boardId}/columns`, data);
    return response.data;
  }

  async updateColumn(id: string, data: UpdateColumnData): Promise<KanbanColumn> {
    const response = await api.patch<KanbanColumn>(`/kanban/columns/${id}`, data);
    return response.data;
  }

  async deleteColumn(id: string): Promise<void> {
    await api.delete(`/kanban/columns/${id}`);
  }

  // Card operations
  async createCard(columnId: string, data: CreateCardData): Promise<KanbanCard> {
    const response = await api.post<KanbanCard>(`/kanban/columns/${columnId}/cards`, data);
    
    // Mock: Add assignee information if assigneeId is provided
    if (data.assigneeId && response.data) {
      const mockAssignees: { [key: string]: KanbanAssignee } = {
        'user1': { id: 'user1', name: 'John Doe' },
        'user2': { id: 'user2', name: 'Jane Admin' },
        'user3': { id: 'user3', name: 'Test User' },
        'user4': { id: 'user4', name: 'James Kang' },
        'user5': { id: 'user5', name: 'Sarah Lee' },
      };
      
      response.data.assignee = mockAssignees[data.assigneeId];
      response.data.assigneeId = data.assigneeId;
    }
    
    return response.data;
  }

  async updateCard(id: string, data: UpdateCardData): Promise<KanbanCard> {
    const response = await api.patch<KanbanCard>(`/kanban/cards/${id}`, data);
    
    // Mock: Add assignee information if assigneeId is provided
    if (data.assigneeId && response.data) {
      const mockAssignees: { [key: string]: KanbanAssignee } = {
        'user1': { id: 'user1', name: 'John Doe' },
        'user2': { id: 'user2', name: 'Jane Admin' },
        'user3': { id: 'user3', name: 'Test User' },
        'user4': { id: 'user4', name: 'James Kang' },
        'user5': { id: 'user5', name: 'Sarah Lee' },
      };
      
      response.data.assignee = mockAssignees[data.assigneeId];
      response.data.assigneeId = data.assigneeId;
    } else if (data.assigneeId === '') {
      // Clear assignee if empty string is provided
      response.data.assignee = undefined;
      response.data.assigneeId = undefined;
    }
    
    return response.data;
  }

  async deleteCard(id: string): Promise<void> {
    await api.delete(`/kanban/cards/${id}`);
  }

  async moveCard(cardId: string, targetColumnId: string, position?: number): Promise<KanbanCard> {
    const response = await api.post<KanbanCard>(`/kanban/cards/${cardId}/move`, {
      target_column_id: targetColumnId,
      position,
    });
    return response.data;
  }

  // Bulk operations
  async bulkUpdateCards(ids: string[], data: UpdateCardData): Promise<KanbanCard[]> {
    const response = await api.patch<KanbanCard[]>('/kanban/cards/bulk', { ids, data });
    return response.data;
  }

  async bulkDeleteCards(ids: string[]): Promise<void> {
    await api.post('/kanban/cards/bulk-delete', { ids });
  }

  // Board templates
  async createBoardFromTemplate(templateType: 'basic' | 'scrum' | 'personal'): Promise<KanbanBoard> {
    const templates = {
      basic: {
        title: 'New Board',
        columns: ['To Do', 'In Progress', 'Done'],
      },
      scrum: {
        title: 'Sprint Board',
        columns: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'],
      },
      personal: {
        title: 'Personal Tasks',
        columns: ['Ideas', 'This Week', 'Today', 'Completed'],
      },
    };

    const template = templates[templateType];
    const board = await this.createBoard({ title: template.title });

    // Create columns for the board
    for (let i = 0; i < template.columns.length; i++) {
      await this.createColumn(board.id, {
        title: template.columns[i],
        position: i,
      });
    }

    // Fetch the updated board with columns
    return await this.getBoard(board.id);
  }

  // Search and filter
  async searchCards(boardId: string, query: string): Promise<KanbanCard[]> {
    const board = await this.getBoard(boardId);
    const allCards: KanbanCard[] = [];
    
    board.columns.forEach(column => {
      const matchingCards = column.cards.filter(card =>
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description?.toLowerCase().includes(query.toLowerCase())
      );
      allCards.push(...matchingCards);
    });
    
    return allCards;
  }

  async getCardsByAssignee(boardId: string, assigneeId: string): Promise<KanbanCard[]> {
    const board = await this.getBoard(boardId);
    const allCards: KanbanCard[] = [];
    
    board.columns.forEach(column => {
      const assignedCards = column.cards.filter(card => card.assigneeId === assigneeId);
      allCards.push(...assignedCards);
    });
    
    return allCards;
  }

  async getOverdueCards(boardId: string): Promise<KanbanCard[]> {
    const board = await this.getBoard(boardId);
    const allCards: KanbanCard[] = [];
    const now = new Date();
    
    board.columns.forEach(column => {
      const overdueCards = column.cards.filter(card => {
        if (!card.dueDate) return false;
        return new Date(card.dueDate) < now;
      });
      allCards.push(...overdueCards);
    });
    
    return allCards;
  }
}

export default new KanbanService();