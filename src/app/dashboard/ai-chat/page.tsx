'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Stethoscope, 
  Shield, 
  BarChart, 
  Bell, 
  AlertTriangle,
  CornerDownLeft,
  Loader2,
  User,
  Bot,
  Users,
  TrendingDown,
  HeartCrack
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { add } from 'date-fns';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { healthChat } from '@/ai/flows/health-chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


const dailyData = [
  { name: 'Today', cases: 30, recovered: 20, deaths: 2 },
  { name: 'Yesterday', cases: 45, recovered: 30, deaths: 5 },
  { name: 'Day Before', cases: 28, recovered: 25, deaths: 1 },
];

const monthlyData = [
  { name: 'This Month', cases: 1200, recovered: 900, deaths: 50 },
  { name: 'Last Month', cases: 1500, recovered: 1100, deaths: 75 },
  { name: '2 Months Ago', cases: 950, recovered: 800, deaths: 30 },
];

const yearlyData = [
  { name: 'This Year', cases: 15000, recovered: 12000, deaths: 600 },
  { name: 'Last Year', cases: 18000, recovered: 15000, deaths: 800 },
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleReminderClick = () => {
    try {
        const newReminder = {
            id: Date.now(),
            title: 'Replace plastic water container',
            startDate: new Date().toISOString(),
            dueDate: add(new Date(), { months: 5 }).toISOString(),
        };

        const existingReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        const updatedReminders = [...existingReminders, newReminder];
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));
        
        toast({
            title: "Reminder Set!",
            description: "We'll remind you to change your plastic container in 5 months.",
        });
    } catch (error) {
        console.error('Failed to save reminder:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not save your reminder. Please try again.',
        });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('dashboard')}</h1>
      </div>
      
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center min-h-[300px]"
        style={{ backgroundImage: "url('https://picsum.photos/1200/400?blur=10')" }}
        data-ai-hint="water droplets"
      >
        <div className="flex flex-col items-center gap-4 text-center bg-background/80 p-8 rounded-lg">
          <div className="flex items-center gap-8">
            <Stethoscope className="h-16 w-16 text-primary" />
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            {t('welcome')}! Your Health is Our Priority
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {t('checkSymptomsPrompt')}
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/dashboard/symptom-checker">{t('symptomChecker')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/precautions">{t('precautions')}</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <AiChat />

      <Card>
          <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-2xl">Waterborne Disease Statistics</CardTitle>
              </div>
              <CardDescription>
                  This section displays mock data for waterborne diseases. In a real application, this would be connected to a live public health data source.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily">
                      <StatsView data={dailyData} period="Daily" />
                  </TabsContent>
                  <TabsContent value="monthly">
                       <StatsView data={monthlyData} period="Monthly" />
                  </TabsContent>
                  <TabsContent value="yearly">
                       <StatsView data={yearlyData} period="Yearly" />
                  </TabsContent>
              </Tabs>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-2xl">Water Storage Safety Tip</CardTitle>
            </div>
             <CardDescription>
                  A small change for a healthier life.
              </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "Instead of using plastics to store water, use copper vessels."
            </blockquote>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                    <p className="font-semibold">Still using plastic containers?</p>
                    <p className="text-sm text-muted-foreground">It's recommended to replace them periodically to avoid chemical leaching.</p>
                </div>
                 <Button onClick={handleReminderClick}>
                    <Bell className="mr-2 h-4 w-4" />
                    Remind me in 5 months
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}


function StatsView({ data, period }: { data: any[], period: string }) {
    const totalCases = data.reduce((acc, item) => acc + item.cases, 0);
    const totalRecovered = data.reduce((acc, item) => acc + item.recovered, 0);
    const totalDeaths = data.reduce((acc, item) => acc + item.deaths, 0);

    return (
        <div className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Cases</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCases.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total {period.toLowerCase()} cases</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recoveries</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRecovered.toLocaleString()}</div>
                         <p className="text-xs text-muted-foreground">Total {period.toLowerCase()} recoveries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deaths</CardTitle>
                        <HeartCrack className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDeaths.toLocaleString()}</div>
                         <p className="text-xs text-muted-foreground">Total {period.toLowerCase()} deaths</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatValues = z.infer<typeof chatSchema>;

interface Message {
    role: 'user' | 'model';
    content: string;
}


function AiChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { effectiveLanguage } = useLanguage();


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
        language: effectiveLanguage,
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
      <Card className="flex flex-col flex-1 h-[600px]">
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
         {error && (
            <CardContent>
              <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            </CardContent>
          )}
      </Card>
  );
}

const StatsCard = ({ title, value, icon: Icon, change, changeType }: { title: string, value: string, icon: React.ElementType, change: string, changeType: 'increase' | 'decrease' }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change} from last month</p>
      </CardContent>
    </Card>
  )
}
