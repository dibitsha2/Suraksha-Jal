
'use client';

import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function RemindersPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('reminders')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Your Reminders</CardTitle>
          <CardDescription>
            All your active reminders will be listed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You have no active reminders at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Reminders you set will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
