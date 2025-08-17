interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

interface WebSocketOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

type MessageHandler = (message: WebSocketMessage) => void;
type EventHandler = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = '';
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts: number = 0;
  private options: WebSocketOptions = {
    reconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
  };
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  connect(url: string, options: WebSocketOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.url = url;
      this.options = { ...this.options, ...options };

      try {
        // Add token to URL
        const token = localStorage.getItem('accessToken');
        const wsUrl = token ? `${url}?token=${token}` : url;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startPing();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopPing();
          this.emit('disconnected');
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.options.reconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  onEvent(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    // Also handle wildcard listeners
    const wildcardHandlers = this.messageHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(message));
    }
  }

  private emit(event: string): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler());
    }
  }

  private handleReconnect(): void {
    if (
      this.options.reconnect &&
      this.reconnectAttempts < (this.options.maxReconnectAttempts || 5)
    ) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect(this.url, this.options).catch(error => {
          console.error('Reconnect failed:', error);
        });
      }, this.options.reconnectInterval);
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getReadyState(): number | null {
    return this.ws ? this.ws.readyState : null;
  }
}

export default new WebSocketService();