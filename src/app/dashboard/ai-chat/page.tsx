
'use client';

import { Suspense } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { AiChat as AiChatComponent } from '@/components/ai-chat';

export default function AiChatPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">AI Health Assistant</h1>
        <Suspense fallback={
            <Card className="flex flex-col flex-1 min-h-[600px]">
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
            <AiChatComponent />
        </Suspense>
    </div>
  );
}
