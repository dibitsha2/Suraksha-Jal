
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HealthWorkerDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Health Worker Dashboard</h1>
      </div>
      
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center min-h-[300px]"
        style={{ backgroundImage: "url('https://picsum.photos/seed/hw/1200/400?blur=10')" }}
        data-ai-hint="medical community"
      >
        <div className="flex flex-col items-center gap-4 text-center bg-background/80 p-8 rounded-lg">
          <HeartPulse className="h-16 w-16 text-primary" />
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Welcome, Health Worker!
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your contributions are vital to community health. Submit reports on local waterborne disease cases to help us track and prevent outbreaks.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/dashboard-health-worker/submit-report">Submit a New Report</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Role</CardTitle>
              <CardDescription>
                  As a verified health worker, you have the ability to submit data on disease outbreaks in your area. This information is critical for public health monitoring and response efforts.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Responsibilities:</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm">
                    <li>Submit timely and accurate reports of waterborne disease cases.</li>
                    <li>Help verify information and spread awareness in your community.</li>
                    <li>Be a trusted source of health information.</li>
                </ul>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
