import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey team, how is the testing going?', sender: 'John', timestamp: new Date('2024-01-15T10:00:00'), isOwn: false },
    { id: '2', text: 'Good! Found 3 critical bugs in the payment flow', sender: 'You', timestamp: new Date('2024-01-15T10:05:00'), isOwn: true },
    { id: '3', text: 'Great catch! Can you document them?', sender: 'John', timestamp: new Date('2024-01-15T10:06:00'), isOwn: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate response
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for the update! I\'ll review them shortly.',
          sender: 'John',
          timestamp: new Date(),
          isOwn: false,
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)]">
      <div className="bg-white rounded-lg shadow h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">QA Team Chat</h1>
            <p className="text-sm text-gray-500">3 members online</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!message.isOwn && (
                    <p className="text-xs font-semibold mb-1">{message.sender}</p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default ChatPage;