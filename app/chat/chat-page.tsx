'use client';

import { useChat } from 'ai/react';
import DynamicComponentRender from './dynamic-render';
import { Message, ToolInvocation } from 'ai';
import { useEffect, useState } from 'react';
import { type Message as AiMessage } from 'ai/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageFormatter } from './message-formatter';
import { SocialMediaAnimation } from './social-media-animation';

interface ComponentData {
  name: string;
  jsx: string;
  props: any;
  children?: ComponentData;
}

interface ExtendedMessage extends Omit<AiMessage, 'parts'> {
  image_url?: string;
  is_accurate?: boolean | null;
  parts?: {
    type: string;
    text?: string;
    toolInvocation?: {
      toolCallId: string;
      toolName: string;
      args: any;
      state: 'partial-call' | 'call' | 'result';
      result?: {
        success: boolean;
        result?: {
          data?: any;
          component?: ComponentData | ComponentData[];
        };
      };
    };
  }[];
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    sendExtraMessageFields: true,
    maxSteps: 25,
  });

  return (
    <div className="p-4 h-screen">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 && (
          <SocialMediaAnimation />
        )}
        
        {messages.map((message: ExtendedMessage) => {
          const extendedMessage = message as unknown as ExtendedMessage;
          
          return (
            <div 
              key={message.id}
              className={`flex gap-4 group ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              <div className={`grid gap-1.5 ${
                message.role === 'user' 
                  ? 'max-w-[75%]'
                  : 'w-full'
              }`}>
                <div className="text-sm leading-relaxed relative">
                  <div className="flex justify-between items-start gap-2">
                    <div className={`${
                      message.role === 'user' 
                        ? 'bg-[#2A2B2C] text-white rounded-3xl rounded-br-sm px-4 py-2 text-[15px] min-w-[60px] text-left'
                        : ''
                    } flex-1`}>
                      <div className="flex-1 min-w-0">
                        {extendedMessage.parts?.map((part, partIndex) => {
                          if (part.type === 'text') {
                            return (
                              <MessageFormatter 
                                key={partIndex} 
                                content={part.text || ''} 
                              />
                            );
                          }
                          if (part.type === 'tool-invocation' && part.toolInvocation) {
                            const { toolCallId, toolName, state } = part.toolInvocation;
                            const result = part.toolInvocation.state === 'result' ? part.toolInvocation.result : undefined;
                            
                            return (
                              <div key={`tool-${toolCallId || partIndex}`} className="py-4">
                                {(['partial-call', 'call'].includes(state)) ? (
                                  <div className="max-w-3xl w-full">
                                    <Skeleton className="h-32 w-full" />
                                  </div>
                                ) : (
                                  state === 'result' && 
                                  result?.success && 
                                  result.result?.component && (
                                    <DynamicComponentRender component={result.result.component} />
                                  )
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                        
                        {(!extendedMessage.parts || extendedMessage.parts.length === 0) && message.content && (
                          <MessageFormatter content={message.content} />
                        )}
                        
                        {(!extendedMessage.parts || extendedMessage.parts.length === 0) && message.toolInvocations?.map((toolInvocation, idx) => {
                          const { toolCallId, toolName, state } = toolInvocation;
                          
                          return (
                            <div key={toolCallId || `tool-${idx}`} className="py-4">
                              {(['partial-call', 'call'].includes(state)) ? (
                                <div className="max-w-3xl w-full">
                                  <Skeleton className="h-32 w-full" />
                                </div>
                              ) : (
                                'result' in toolInvocation && 
                                toolInvocation.result?.success && 
                                toolInvocation.result?.result?.component && (
                                  <DynamicComponentRender 
                                    component={toolInvocation.result.result.component} 
                                  />
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start mt-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-2 animate-pulse">
              <div className="w-8 h-8 relative">
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce ml-1" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce ml-1" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 px-4 z-10">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 bg-background/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border">
            <div className="flex-1 relative">
              <Input
                className="w-full pr-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              variant="default" 
              className="rounded-full px-4"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}