
'use client';

import Link from 'next/link';
import { Stethoscope, Shield, GlassWater, Apple, Bot, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

const healthTips = [
  {
    icon: GlassWater,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of safe, clean water throughout the day to keep your body functioning optimally.',
  },
  {
    icon: Apple,
    title: 'Eat Nutritious Food',
    description: 'A balanced diet rich in fruits and vegetables is key. An apple a day can help keep the doctor away!',
  },
  {
    icon: HandHeart,
    title: 'Practice Good Hygiene',
    description: 'Wash hands frequently with soap, especially before meals and after using the toilet, to prevent infections.',
  },
  {
    icon: Bot,
    title: 'Use AI for Help',
    description: 'When in doubt, use our AI tools to check symptoms or get medication suggestions, but always consult a doctor.',
  },
];


export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('dashboard')}</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center"
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
      
      <div>
        <h2 className="text-xl font-semibold mb-4 font-headline">Daily Health Reminders</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {healthTips.map((tip, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{tip.title}</CardTitle>
                        <tip.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </>
  );
}
