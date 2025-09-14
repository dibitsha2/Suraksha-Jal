
'use client';

import Link from 'next/link';
import { useState, lazy, Suspense } from 'react';
import { 
  Stethoscope, 
  Shield, 
  BarChart, 
  Bell, 
  AlertTriangle,
  Loader2,
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
import { Skeleton } from '@/components/ui/skeleton';

const AiChat = lazy(() => import('@/components/ai-chat').then(module => ({ default: module.AiChat })));

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
      
      <Suspense fallback={
          <Card className="flex flex-col flex-1 h-[600px]">
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <div className="flex-1 space-y-4 p-4 border rounded-lg mb-4 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Skeleton className="h-[60px] w-full" />
            </CardContent>
          </Card>
      }>
        <AiChat />
      </Suspense>

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
