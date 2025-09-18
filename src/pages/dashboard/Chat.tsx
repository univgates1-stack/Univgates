import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  MessageSquare,
  Users
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  type: 'student' | 'agent' | 'university' | 'support';
  status: 'online' | 'offline' | 'away';
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'MIT Admissions Office',
      lastMessage: 'We have received your application and will review it shortly.',
      lastMessageTime: '2 hours ago',
      unreadCount: 1,
      type: 'university',
      status: 'online'
    },
    {
      id: '2',
      name: 'Education Agent - Sarah Wilson',
      lastMessage: 'I can help you with your visa application process.',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      type: 'agent',
      status: 'away'
    },
    {
      id: '3',
      name: 'Support Team',
      lastMessage: 'Your document has been successfully uploaded.',
      lastMessageTime: '3 days ago',
      unreadCount: 2,
      type: 'support',
      status: 'online'
    }
  ];

  // Mock messages data
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        senderId: 'mit-admissions',
        senderName: 'MIT Admissions Office',
        content: 'Hello! We have received your application for the Computer Science program.',
        timestamp: '2024-01-15T10:00:00Z',
        isOwn: false
      },
      {
        id: '2',
        senderId: 'student',
        senderName: 'You',
        content: 'Thank you! When can I expect to hear back about the status?',
        timestamp: '2024-01-15T10:05:00Z',
        isOwn: true
      },
      {
        id: '3',
        senderId: 'mit-admissions',
        senderName: 'MIT Admissions Office',
        content: 'We will review your application within the next 4-6 weeks. We may contact you if we need any additional documents.',
        timestamp: '2024-01-15T14:30:00Z',
        isOwn: false
      }
    ],
    '2': [
      {
        id: '1',
        senderId: 'agent',
        senderName: 'Sarah Wilson',
        content: 'Hi! I\'m here to help with your university applications. Do you have any questions?',
        timestamp: '2024-01-14T09:00:00Z',
        isOwn: false
      },
      {
        id: '2',
        senderId: 'student',
        senderName: 'You',
        content: 'Yes, I need help with my visa application for studying in the US.',
        timestamp: '2024-01-14T09:15:00Z',
        isOwn: true
      }
    ]
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Here you would send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university':
        return '🏫';
      case 'agent':
        return '👤';
      case 'support':
        return '💬';
      default:
        return '💬';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with universities, agents, and support team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Conversations</span>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted
                      ${selectedConversation === conversation.id ? 'bg-muted' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>
                            {getTypeIcon(conversation.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {conversation.name}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentConversation.avatar} />
                      <AvatarFallback>
                        {getTypeIcon(currentConversation.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentConversation.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentConversation.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-22rem)] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            max-w-[70%] p-3 rounded-lg
                            ${message.isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                            }
                          `}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;