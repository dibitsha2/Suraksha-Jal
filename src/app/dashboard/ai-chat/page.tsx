
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CornerDownLeft, Loader2, Sparkles, User, Bot, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { healthChat } from '@/ai/flows/health-chatbot';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatValues = z.infer<typeof chatSchema>;

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function AiChatPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { t } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const form = useForm<ChatValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });
  
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<ChatValues> = async (data) => {
    setLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const response = await healthChat({
        message: data.message,
        history: history,
      });
      const modelMessage: Message = { role: 'model', content: response.response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('aiChat')}</h1>
      </div>
      <Card className="flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Health Assistant</CardTitle>
          <CardDescription>
            Ask me anything about waterborne diseases, symptoms, or general health.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <ScrollArea className="flex-1 space-y-4 p-4 border rounded-lg mb-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4" />
                    <p>No messages yet. Start the conversation!</p>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-4 mb-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                         {msg.role === 'model' && (
                             <div className="p-2 bg-primary text-primary-foreground rounded-full">
                                <Bot className="h-6 w-6" />
                             </div>
                         )}
                         <div className={cn("max-w-[75%] p-3 rounded-lg", msg.role === 'user' ? 'bg-primary/10' : 'bg-muted')}>
                             <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                         </div>
                          {msg.role === 'user' && (
                             <div className="p-2 bg-secondary text-secondary-foreground rounded-full">
                                <User className="h-6 w-6" />
                             </div>
                         )}
                    </div>
                ))
            )}
            {loading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex items-start gap-4 mb-4 justify-start">
                    <div className="p-2 bg-primary text-primary-foreground rounded-full">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                </div>
            )}
          </ScrollArea>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What are the symptoms of Cholera?"
                        className="min-h-[60px] pr-20"
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                            }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-2" />
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={loading} className="absolute top-1/2 -translate-y-1/2 right-3">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="border-destructive">
          <CardHeader className="flex-row gap-4 items-center">
            <AlertTriangle className="text-destructive" />
            <div>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

    </div>
  );
}
