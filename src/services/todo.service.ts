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
    
    const response = await api.get<TodosResponse>(`/todos?${params}`);
    return response.data;
  }

  async getTodo(id: string): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  }

  async updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  }

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  async toggleTodo(id: string): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}/toggle`);
    return response.data;
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