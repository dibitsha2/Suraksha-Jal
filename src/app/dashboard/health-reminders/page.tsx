
'use client';

import { GlassWater, Apple, Bot, HandHeart, Filter, Video as VideoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoDialog } from '@/components/water-filter-video-dialog';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';


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
    icon: Filter,
    title: 'Drink Filtered Water',
    description: 'Always consume filtered or boiled water. If you don\'t have a filter, you can learn a natural filtration method.',
    action: <VideoDialog 
                trigger={
                    <Button variant="outline" size="sm">
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Watch Video Guide
                    </Button>
                }
                title="Natural Water Filtration"
                description="Learn how to create a simple and effective water filter using natural materials."
                videoUrl="https://www.youtube.com/embed/lHFElyiA2m8"
            />,
  },
  {
    icon: Bot,
    title: 'Use AI for Help',
    description: 'When in doubt, use our AI tools to check symptoms or get medication suggestions, but always consult a doctor.',
  },
];

export default function HealthRemindersPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('healthReminders')}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {healthTips.map((tip, index) => (
              <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{tip.title}</CardTitle>
                      <tip.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                      <p className="text-sm text-muted-foreground flex-1">{tip.description}</p>
                      {tip.action && <div className="mt-4">{tip.action}</div>}
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
