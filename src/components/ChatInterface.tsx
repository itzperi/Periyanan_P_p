"use client";

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Info, Loader2 } from 'lucide-react';
import { interactiveChatbot, type InteractiveChatbotInput, type InteractiveChatbotOutput } from '@/ai/flows/interactive-chatbot';
import type { ChatMessage } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { marked } from 'marked'; // For rendering markdown from bot responses

interface ChatInterfaceProps {
  meetingContent: string;
  initialMessages?: ChatMessage[];
}

export default function ChatInterface({ meetingContent, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatbotInput: InteractiveChatbotInput = {
        meetingContent: meetingContent,
        userQuestion: userMessage.text,
      };
      const botResponse: InteractiveChatbotOutput = await interactiveChatbot(chatbotInput);
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.answer,
        citations: botResponse.sourceCitations,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error interacting with chatbot:', error);
      const errorMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: "Sorry, I encountered an error trying to respond. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
              )}
              <Card 
                className={`max-w-[75%] p-3 shadow-md ${
                  message.sender === 'user'
                    ? 'rounded-l-xl rounded-tr-xl bg-primary text-primary-foreground'
                    : 'rounded-r-xl rounded-tl-xl bg-muted'
                }`}
              >
                <CardContent className="p-0 text-sm break-words">
                  <div dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} />
                  {message.citations && (
                    <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                      <p className="text-xs text-muted-foreground/80 flex items-center">
                        <Info size={12} className="mr-1 shrink-0" />
                        Citations: {message.citations}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {message.sender === 'user' && (
                 <Avatar className="h-8 w-8">
                   <AvatarFallback><User size={18} /></AvatarFallback>
                 </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot size={18} /></AvatarFallback>
              </Avatar>
              <Card className="max-w-[75%] p-3 shadow-md rounded-r-xl rounded-tl-xl bg-muted">
                <CardContent className="p-0 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t p-4 bg-background">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about the meeting..."
          className="flex-grow"
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
}
