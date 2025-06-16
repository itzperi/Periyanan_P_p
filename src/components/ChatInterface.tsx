"use client";

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Info, Loader2, MessageCircle } from 'lucide-react';
import { interactiveChatbot, type InteractiveChatbotInput, type InteractiveChatbotOutput } from '@/ai/flows/interactive-chatbot';
import type { ChatMessage } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { marked } from 'marked'; // Ensure marked is installed

interface ChatInterfaceProps {
  meetingContent: string;
  initialMessages?: ChatMessage[];
}

export default function ChatInterface({ meetingContent, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages.length > 0 ? initialMessages : [
    {
      id: `bot-initial-${Date.now()}`,
      sender: 'bot',
      text: "Hello! I'm your meeting assistant. Ask me anything about the current meeting's content.",
      timestamp: Date.now(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Initialize marked - configure if needed
  marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false, // Be cautious with this in production if content isn't trusted
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue(''); // Clear input immediately

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
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
        text: "Sorry, I encountered an error trying to respond. Please check the console or try again later.",
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card/30">
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2.5 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-9 w-9 self-start border-2 border-primary/50">
                  <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <Card 
                className={`max-w-[80%] p-3 shadow-md ${
                  message.sender === 'user'
                    ? 'rounded-l-xl rounded-tr-xl bg-primary text-primary-foreground'
                    : 'rounded-r-xl rounded-tl-xl bg-muted text-foreground/90'
                }`}
              >
                <CardContent className="p-0 text-sm break-words prose dark:prose-invert prose-p:my-1 prose-headings:my-2 max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: marked.parse(message.text) as string }} />
                  {message.citations && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground/80 flex items-center">
                        <Info size={14} className="mr-1.5 shrink-0" />
                        Citations: {message.citations}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {message.sender === 'user' && (
                 <Avatar className="h-9 w-9 self-start border-2 border-accent/50">
                   <AvatarFallback className="bg-accent/20 text-accent"><User size={20} /></AvatarFallback>
                 </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <Avatar className="h-9 w-9 self-start border-2 border-primary/50">
                <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
              </Avatar>
              <Card className="max-w-[75%] p-3 shadow-md rounded-r-xl rounded-tl-xl bg-muted">
                <CardContent className="p-0 text-sm flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">Thinking...</span>
                </CardContent>
              </Card>
            </div>
          )}
           {!meetingContent || meetingContent === "No meeting content available to chat about." && messages.length <=1 && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-border/50">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No Meeting Content Loaded</p>
              <p className="text-sm">Please ensure a meeting transcript is available to activate the chat assistant.</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 border-t border-border/50 p-4 bg-background/70">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={meetingContent && meetingContent !== "No meeting content available to chat about." ? "Ask about the meeting..." : "Meeting content needed to chat..."}
          className="flex-grow bg-input border-border/70 focus:border-primary text-base"
          disabled={isLoading || !meetingContent || meetingContent === "No meeting content available to chat about."}
          aria-label="Chat message input"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !inputValue.trim() || !meetingContent || meetingContent === "No meeting content available to chat about."} 
          aria-label="Send message"
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-10 h-10"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
}
