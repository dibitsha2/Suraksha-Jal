
'use client';

import { useState, useEffect } from 'react';
import { Bell, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Reminder {
  id: number;
  title: string;
  startDate: string;
  dueDate: string;
}

export default function RemindersPage() {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const deleteReminder = (id: number) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };
  
  if (!isMounted) {
    return null; // Avoids SSR mismatch
  }

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
          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
              <Bell className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no active reminders at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Reminders you set will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <p className="font-semibold">{reminder.title}</p>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                        <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Set on: {format(new Date(reminder.startDate), 'PPP')}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">Due on: {format(new Date(reminder.dueDate), 'PPP')}</span>
                        </p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => deleteReminder(reminder.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete reminder</span>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
