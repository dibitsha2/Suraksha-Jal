
'use client';
import Link from 'next/link';
import AuthForm from '@/components/auth/auth-form';
import { SurakshaJalLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FilePlus, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'The page URL has been copied to your clipboard.',
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        variant: 'destructive',
        title: 'Failed to Copy',
        description: 'Could not copy the link. Please try again.',
      });
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <SurakshaJalLogo className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-primary font-headline">Suraksha Jal</h1>
          <p className="text-muted-foreground">
            Your partner in preventing waterborne diseases.
          </p>
        </div>
        <AuthForm initialTab="login" userType="user" />

        <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
        </div>

        <Separator className="my-6" />

        <div className="text-center">
            <p className="mb-4 text-muted-foreground">Are you a health worker?</p>
            <Button asChild variant="outline">
                <Link href="/health-worker/login">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Health Worker Portal
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
