
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clipboard, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Clipboard,
    title: 'Submit Report',
    description: 'Submit a new waterborne disease report for your area.',
    href: '#',
  },
  {
    icon: UserCheck,
    title: 'Patient Follow-up',
    description: 'Manage and update records for patients you are monitoring.',
    href: '#',
  },
  {
    icon: ShieldCheck,
    title: 'Health Guidelines',
    description: 'Access the latest public health guidelines and protocols.',
    href: '#',
  },
];

export default function HealthWorkerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Health Worker Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-muted-foreground flex-1">{feature.description}</p>
              <Link href={feature.href} className="mt-4 text-sm font-semibold text-primary hover:underline">
                Go to {feature.title} &rarr;
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome, Health Worker!</CardTitle>
            <CardDescription>
                Thank you for your service. This dashboard is designed to help you with your daily tasks. Use the links above to navigate to different sections.
            </CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">More features and tools for health workers will be added here in the future.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    