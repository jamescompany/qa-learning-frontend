import api from './api';
import { Todo } from '../types/todo.types';

interface CreateTodoData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface UpdateTodoData extends Partial<CreateTodoData> {
  completed?: boolean;
  status?: string;
}

interface TodosResponse {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
}

interface TodoFilters {
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  order?: 'asc' | 'desc';
}

class TodoService {
  async getTodos(filters: TodoFilters = {}): Promise<TodosResponse> {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      params.append('completed', String(filters.status === 'completed'));
    }
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    
    const response = await api.get<any>(`/todos/?${params}`);
    console.log('TodoService getTodos raw response:', response.data.todos);
    // Map backend response to frontend Todo type
    const todos = (response.data.todos || []).map((todo: any) => {
      // Clean up the todo object - remove snake_case fields after mapping
      const { due_date, completed_at, created_at, updated_at, created_by, user_id, is_archived, ...cleanTodo } = todo;
      
      const mapped = {
        ...cleanTodo,
        completed: todo.status === 'DONE' || todo.status === 'done',
        priority: todo.priority?.toLowerCase() || 'medium',
        status: todo.status?.toLowerCase() || 'todo',
        tags: todo.tags || [],
        attachments: todo.attachments || [],
        checklist: todo.checklist || [],
        dueDate: due_date || todo.dueDate,
        completedAt: completed_at || todo.completedAt,
        createdAt: created_at || todo.createdAt,
        updatedAt: updated_at || todo.updatedAt,
        createdBy: created_by || user_id || todo.createdBy,
      };
      console.log('TodoService mapped todo:', { 
        id: mapped.id, 
        title: mapped.title,
        due_date: todo.due_date,
        dueDate: mapped.dueDate 
      });
      return mapped;
    });
    
    return {
      ...response.data,
      todos
    };
  }

  async getTodo(id: string): Promise<Todo> {
    const response = await api.get<any>(`/todos/${id}`);
    const todo = response.data;
    const { due_date, completed_at, created_at, updated_at, created_by, user_id, is_archived, ...cleanTodo } = todo;
    
    return {
      ...cleanTodo,
      completed: todo.status === 'DONE' || todo.status === 'done',
      priority: todo.priority?.toLowerCase() || 'medium',
      status: todo.status?.toLowerCase() || 'todo',
      tags: todo.tags || [],
      attachments: todo.attachments || [],
      checklist: todo.checklist || [],
      dueDate: due_date || todo.dueDate,
      completedAt: completed_at || todo.completedAt,
      createdAt: created_at || todo.createdAt,
      updatedAt: updated_at || todo.updatedAt,
      createdBy: created_by || user_id || todo.createdBy,
    };
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    const requestData: any = {
      title: data.title,
      description: data.description || '',
      priority: data.priority?.toLowerCase() || 'medium', // Backend expects lowercase
    };
    // Only add due_date if dueDate is provided
    if (data.dueDate) {
      // Create a proper Date object and convert to ISO string
      const date = new Date(data.dueDate);
      if (!isNaN(date.getTime())) {
        // Use toISOString() which returns format: 2025-01-01T00:00:00.000Z
        requestData.due_date = date.toISOString();
      } else {
        console.error('Invalid date format:', data.dueDate);
      }
    }
    
    console.log('CreateTodo request data:', requestData);
    
    try {
      const response = await api.post<any>('/todos/', requestData);
      const todo = response.data;
      const { due_date, completed_at, created_at, updated_at, created_by, user_id, is_archived, ...cleanTodo } = todo;
      
      return {
        ...cleanTodo,
        completed: todo.status === 'DONE' || todo.status === 'done',
        priority: todo.priority?.toLowerCase() || 'medium',
        status: todo.status?.toLowerCase() || 'todo',
        tags: todo.tags || [],
        attachments: todo.attachments || [],
        checklist: todo.checklist || [],
        dueDate: due_date || todo.dueDate,
        completedAt: completed_at || todo.completedAt,
        createdAt: created_at || todo.createdAt,
        updatedAt: updated_at || todo.updatedAt,
        createdBy: created_by || user_id || todo.createdBy,
      };
    } catch (error: any) {
      console.error('CreateTodo error:', error.response?.data);
      throw error;
    }
  }

  async updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
    const requestData: any = {};
    
    // Only include fields that are actually provided
    if (data.title !== undefined) requestData.title = data.title;
    if (data.description !== undefined) requestData.description = data.description;
    if (data.priority !== undefined) requestData.priority = data.priority.toLowerCase(); // Backend expects lowercase
    if (data.status !== undefined) requestData.status = data.status.toUpperCase();
    if (data.dueDate !== undefined) {
      // Convert date to ISO 8601 format with time component
      if (data.dueDate) {
        // Create a proper Date object and convert to ISO string
        const date = new Date(data.dueDate);
        if (!isNaN(date.getTime())) {
          // Use toISOString() which returns format: 2025-01-01T00:00:00.000Z
          requestData.due_date = date.toISOString();
        } else {
          console.error('Invalid date format:', data.dueDate);
          requestData.due_date = null;
        }
      } else {
        requestData.due_date = null;
      }
    }
    
    console.log('UpdateTodo request data:', requestData);
    
    try {
      const response = await api.patch<any>(`/todos/${id}`, requestData);
      const todo = response.data;
      const { due_date, completed_at, created_at, updated_at, created_by, user_id, is_archived, ...cleanTodo } = todo;
      
      return {
        ...cleanTodo,
        completed: todo.status === 'DONE' || todo.status === 'done',
        priority: todo.priority?.toLowerCase() || 'medium',
        status: todo.status?.toLowerCase() || 'todo',
        tags: todo.tags || [],
        attachments: todo.attachments || [],
        checklist: todo.checklist || [],
        dueDate: due_date || todo.dueDate,
        completedAt: completed_at || todo.completedAt,
        createdAt: created_at || todo.createdAt,
        updatedAt: updated_at || todo.updatedAt,
        createdBy: created_by || user_id || todo.createdBy,
      };
    } catch (error: any) {
      console.error('UpdateTodo error response:', error.response);
      console.error('UpdateTodo error details:', error.response?.data?.detail);
      if (error.response?.data?.detail) {
        console.error('Full error detail:', JSON.stringify(error.response.data.detail, null, 2));
      }
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  async toggleTodo(id: string): Promise<Todo> {
    const response = await api.patch<any>(`/todos/${id}/toggle`);
    const todo = response.data;
    const { due_date, completed_at, created_at, updated_at, created_by, user_id, is_archived, ...cleanTodo } = todo;
    
    return {
      ...cleanTodo,
      completed: todo.status === 'DONE' || todo.status === 'done',
      priority: todo.priority?.toLowerCase() || 'medium',
      status: todo.status?.toLowerCase() || 'todo',
      tags: todo.tags || [],
      attachments: todo.attachments || [],
      checklist: todo.checklist || [],
      dueDate: due_date || todo.dueDate,
      completedAt: completed_at || todo.completedAt,
      createdAt: created_at || todo.createdAt,
      updatedAt: updated_at || todo.updatedAt,
      createdBy: created_by || user_id || todo.createdBy,
    };
  }

  async bulkUpdateTodos(ids: string[], data: UpdateTodoData): Promise<Todo[]> {
    const response = await api.patch<Todo[]>('/todos/bulk', { ids, data });
    return response.data;
  }

  async bulkDeleteTodos(ids: string[]): Promise<void> {
    await api.post('/todos/bulk-delete', { ids });
  }

  async getUpcomingTodos(days: number = 7): Promise<Todo[]> {
    const response = await api.get<Todo[]>(`/todos/upcoming?days=${days}`);
    return response.data;
  }

  async getOverdueTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos/overdue');
    return response.data;
  }

  async getTodosByDate(date: string): Promise<Todo[]> {
    const response = await api.get<Todo[]>(`/todos/by-date?date=${date}`);
    return response.data;
  }

  async getTodoStats(): Promise<{
    total: number;
    completed: number;
    active: number;
    overdue: number;
    completionRate: number;
  }> {
    const response = await api.get('/todos/stats');
    return response.data;
  }

  async exportTodos(format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const response = await api.get(`/todos/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new TodoService();