import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

interface UseWebSocketOptions {
  url?: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeat?: boolean;
  heartbeatInterval?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onReconnect?: (attempt: number) => void;
}

interface UseWebSocketReturn {
  sendMessage: (message: any) => void;
  sendJsonMessage: (message: any) => void;
  lastMessage: any;
  lastJsonMessage: any;
  readyState: number;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    heartbeat = true,
    heartbeatInterval = 30000,
    onOpen,
    onMessage,
    onError,
    onClose,
    onReconnect,
  } = options;

  const { user } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [lastJsonMessage, setLastJsonMessage] = useState<any>(null);

  const isConnected = readyState === WebSocket.OPEN;

  // Clear intervals
  const clearIntervals = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (!heartbeat) return;

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, heartbeatInterval);
  }, [heartbeat, heartbeatInterval]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Build URL with authentication
    let wsUrl = url;
    const token = localStorage.getItem('accessToken');
    if (token && user) {
      wsUrl = `${url}?token=${token}`;
    }

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = (event) => {
        console.log('WebSocket connected');
        setReadyState(WebSocket.OPEN);
        reconnectAttemptsRef.current = 0;
        startHeartbeat();

        if (onOpen) {
          onOpen(event);
        }
      };

      wsRef.current.onmessage = (event) => {
        setLastMessage(event.data);

        try {
          const jsonData = JSON.parse(event.data);
          setLastJsonMessage(jsonData);

          // Handle pong response
          if (jsonData.type === 'pong') {
            return;
          }

          if (onMessage) {
            onMessage(jsonData);
          }
        } catch (e) {
          // Not JSON, use raw message
          if (onMessage) {
            onMessage(event.data);
          }
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setReadyState(wsRef.current?.readyState || WebSocket.CLOSED);

        if (onError) {
          onError(event);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected');
        setReadyState(WebSocket.CLOSED);
        clearIntervals();

        if (onClose) {
          onClose(event);
        }

        // Attempt reconnection
        if (reconnect && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current++;
          
          if (onReconnect) {
            onReconnect(reconnectAttemptsRef.current);
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setReadyState(WebSocket.CLOSED);
    }
  }, [url, user, reconnect, reconnectInterval, reconnectAttempts, startHeartbeat, clearIntervals, onOpen, onMessage, onError, onClose, onReconnect]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    clearIntervals();
    reconnectAttemptsRef.current = reconnectAttempts; // Prevent auto-reconnect

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setReadyState(WebSocket.CLOSED);
  }, [clearIntervals, reconnectAttempts]);

  // Manual reconnect
  const reconnectManual = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // Send message
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Send JSON message
  const sendJsonMessage = useCallback((message: any) => {
    sendMessage(JSON.stringify(message));
  }, [sendMessage]);

  // Auto-connect on mount if user is authenticated
  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  // Update ready state
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current) {
        setReadyState(wsRef.current.readyState);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    isConnected,
    connect,
    disconnect,
    reconnect: reconnectManual,
  };
};

// Chat-specific WebSocket hook
export const useChatWebSocket = (roomId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [typing, setTyping] = useState<{ userId: string; isTyping: boolean }[]>([]);

  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, data.message]);
        break;
      case 'user_joined':
        setUsers(prev => [...prev, data.user]);
        break;
      case 'user_left':
        setUsers(prev => prev.filter(u => u.id !== data.userId));
        break;
      case 'typing':
        setTyping(prev => {
          const existing = prev.find(t => t.userId === data.userId);
          if (existing) {
            return prev.map(t => 
              t.userId === data.userId ? { ...t, isTyping: data.isTyping } : t
            );
          }
          return [...prev, { userId: data.userId, isTyping: data.isTyping }];
        });
        break;
      case 'history':
        setMessages(data.messages);
        setUsers(data.users);
        break;
      default:
        break;
    }
  }, []);

  const ws = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL}/chat/${roomId}`,
    onMessage: handleMessage,
    onOpen: () => {
      console.log(`Connected to chat room: ${roomId}`);
    },
  });

  const sendMessage = useCallback((text: string) => {
    ws.sendJsonMessage({
      type: 'message',
      text,
      roomId,
    });
  }, [ws, roomId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    ws.sendJsonMessage({
      type: 'typing',
      isTyping,
      roomId,
    });
  }, [ws, roomId]);

  return {
    ...ws,
    messages,
    users,
    typing,
    sendMessage,
    sendTyping,
  };
};

// Notification WebSocket hook
export const useNotificationWebSocket = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNotification = useCallback((data: any) => {
    switch (data.type) {
      case 'notification':
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(data.notification.title, {
            body: data.notification.body,
            icon: '/icon-192x192.png',
          });
        }
        break;
      case 'notification_read':
        setNotifications(prev => 
          prev.map(n => n.id === data.notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        break;
      case 'notification_history':
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        break;
      default:
        break;
    }
  }, []);

  const ws = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL}/notifications`,
    onMessage: handleNotification,
  });

  const markAsRead = useCallback((notificationId: string) => {
    ws.sendJsonMessage({
      type: 'mark_read',
      notificationId,
    });
  }, [ws]);

  const markAllAsRead = useCallback(() => {
    ws.sendJsonMessage({
      type: 'mark_all_read',
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [ws]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    ...ws,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

// Real-time collaboration hook
export const useCollaborationWebSocket = (documentId: string) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [cursors, setCursors] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [selections, setSelections] = useState<Map<string, { start: number; end: number }>>(new Map());

  const handleCollaboration = useCallback((data: any) => {
    switch (data.type) {
      case 'user_joined':
        setCollaborators(prev => [...prev, data.user]);
        break;
      case 'user_left':
        setCollaborators(prev => prev.filter(u => u.id !== data.userId));
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.delete(data.userId);
          return newCursors;
        });
        setSelections(prev => {
          const newSelections = new Map(prev);
          newSelections.delete(data.userId);
          return newSelections;
        });
        break;
      case 'cursor_move':
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.set(data.userId, { x: data.x, y: data.y });
          return newCursors;
        });
        break;
      case 'selection_change':
        setSelections(prev => {
          const newSelections = new Map(prev);
          newSelections.set(data.userId, { start: data.start, end: data.end });
          return newSelections;
        });
        break;
      case 'document_change':
        // Handle document changes (e.g., operational transform)
        break;
      case 'collaborators':
        setCollaborators(data.users);
        break;
      default:
        break;
    }
  }, []);

  const ws = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL}/collaborate/${documentId}`,
    onMessage: handleCollaboration,
  });

  const sendCursorPosition = useCallback((x: number, y: number) => {
    ws.sendJsonMessage({
      type: 'cursor_move',
      x,
      y,
    });
  }, [ws]);

  const sendSelection = useCallback((start: number, end: number) => {
    ws.sendJsonMessage({
      type: 'selection_change',
      start,
      end,
    });
  }, [ws]);

  const sendDocumentChange = useCallback((change: any) => {
    ws.sendJsonMessage({
      type: 'document_change',
      change,
    });
  }, [ws]);

  return {
    ...ws,
    collaborators,
    cursors,
    selections,
    sendCursorPosition,
    sendSelection,
    sendDocumentChange,
  };
};

// Live data streaming hook
export const useLiveDataWebSocket = (channel: string) => {
  const [data, setData] = useState<any[]>([]);
  const [buffer, setBuffer] = useState<any[]>([]);
  const bufferRef = useRef<any[]>([]);
  const flushIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleData = useCallback((message: any) => {
    if (message.type === 'data') {
      bufferRef.current.push(message.data);
    } else if (message.type === 'snapshot') {
      setData(message.data);
      bufferRef.current = [];
    }
  }, []);

  const ws = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL}/stream/${channel}`,
    onMessage: handleData,
  });

  // Flush buffer periodically
  useEffect(() => {
    flushIntervalRef.current = setInterval(() => {
      if (bufferRef.current.length > 0) {
        setData(prev => [...prev, ...bufferRef.current]);
        setBuffer([...bufferRef.current]);
        bufferRef.current = [];
      }
    }, 100);

    return () => {
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
      }
    };
  }, []);

  const subscribe = useCallback((topic: string) => {
    ws.sendJsonMessage({
      type: 'subscribe',
      topic,
    });
  }, [ws]);

  const unsubscribe = useCallback((topic: string) => {
    ws.sendJsonMessage({
      type: 'unsubscribe',
      topic,
    });
  }, [ws]);

  return {
    ...ws,
    data,
    buffer,
    subscribe,
    unsubscribe,
  };
};