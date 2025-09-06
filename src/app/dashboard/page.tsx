
'use client';

import Link from 'next/link';
import { Stethoscope, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

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
    </>
  );
}
