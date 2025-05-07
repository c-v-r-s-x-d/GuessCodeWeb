import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { apiClient } from '../../services/apiClient';
import { notify, handleApiError } from '../../utils/notifications';

interface Message {
  userId: number;
  text: string;
}

interface ChatRoomProps {
  roomId: string;
  onClose: () => void;
}

export default function ChatRoom({ roomId, onClose }: ChatRoomProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connectToHub = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const connection = new HubConnectionBuilder()
          .withUrl(`${baseUrl}/chat-hub`, {
            skipNegotiation: true,
            transport: 1 // WebSockets
          })
          .withAutomaticReconnect()
          .build();

        connection.on('ReceiveMessage', (userId: number, message: string) => {
          setMessages(prev => [...prev, { userId, text: message }]);
        });

        await connection.start();
        await connection.invoke('JoinRoom', roomId);
        
        connectionRef.current = connection;
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting to chat:', error);
      }
    };

    connectToHub();

    return () => {
      const cleanup = async () => {
        if (connectionRef.current) {
          try {
            await connectionRef.current.invoke('LeaveRoom', roomId);
          } catch (error) {
            console.error('Error leaving room:', error);
          }
          try {
            await connectionRef.current.stop();
          } catch (error) {
            console.error('Error stopping connection:', error);
          }
        }
      };
      cleanup();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connectionRef.current || !user) {
      console.log('Cannot send message:', { 
        messageEmpty: !newMessage.trim(), 
        noConnection: !connectionRef.current, 
        noUser: !user 
      });
      return;
    }

    try {
      console.log('Sending message:', { roomId, userId: user.userId, message: newMessage });
      await connectionRef.current.invoke('SendMessageToRoom', roomId, user.userId, newMessage);
      console.log('Message sent successfully');
      setNewMessage('');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4
      ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
      <div className={`w-full max-w-2xl rounded-lg shadow-xl
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Чат</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80
              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            ✕
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.userId === user?.userId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-lg p-3
                ${msg.userId === user?.userId
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark'
                  ? 'bg-background-dark border-gray-700 text-text-dark'
                  : 'border-gray-300 text-text-light'
                }`}
            />
            <button
              type="submit"
              disabled={!isConnected}
              className={`px-4 py-2 rounded-lg text-white transition-colors
                ${theme === 'dark'
                  ? 'bg-primary-dark hover:bg-blue-500 disabled:bg-gray-700'
                  : 'bg-primary hover:bg-blue-700 disabled:bg-gray-400'
                }`}
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 