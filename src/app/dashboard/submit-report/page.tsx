
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, FilePlus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reportSchema = z.object({
  disease: z.string().min(1, 'Please select a disease.'),
  location: z.string().min(3, 'Please enter a location.'),
  cases: z.coerce.number().min(1, 'Number of cases must be at least 1.'),
});

type ReportValues = z.infer<typeof reportSchema>;

const commonDiseases = ['Cholera', 'Typhoid', 'Hepatitis A', 'Hepatitis E', 'Giardiasis', 'Dysentery', 'Leptospirosis'];

export default function SubmitReportPage() {
  const [loading, setLoading] = useState(false);
  const [isHealthWorker, setIsHealthWorker] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      disease: '',
      location: '',
      cases: 1,
    },
  });

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.isHealthWorker) {
          setIsHealthWorker(true);
          // Pre-fill location if available
          if (profile.address) {
            form.setValue('location', profile.address.split(',').slice(0,2).join(', '));
          }
        } else {
          setIsHealthWorker(false);
        }
      } else {
        setIsHealthWorker(false);
      }
    } catch (e) {
      console.error('Could not verify health worker status', e);
      setIsHealthWorker(false);
    }
  }, [form]);

  const onSubmit: SubmitHandler<ReportValues> = async (data) => {
    setLoading(true);
    // This is a mock submission. In a real app, this would be an API call.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would add the new report to your database.
    // For this demo, we'll just show a success message.
    console.log('New report submitted:', data);

    toast({
      title: 'Report Submitted!',
      description: 'Thank you for contributing to public health data.',
    });

    setLoading(false);
    router.push('/dashboard/local-reports');
  };
  
  if (isHealthWorker === null) {
      return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }
  
  if (isHealthWorker === false) {
      return (
         <Card className="border-destructive">
          <CardHeader className="flex-row gap-4 items-center">
            <AlertTriangle className="text-destructive h-8 w-8" />
            <div>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
              <CardDescription className="text-destructive/80">You must be a verified health worker to access this page.</CardDescription>
                <Button variant="destructive" asChild className="mt-4">
                    <a href="/dashboard/profile">Verify Your ID</a>
                </Button>
            </div>
          </CardHeader>
        </Card>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Submit New Health Report</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-primary" />
            <span>Waterborne Disease Report Form</span>
          </CardTitle>
          <CardDescription>
            Fill out the form below to report new cases of waterborne diseases in your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="disease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disease</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the disease you are reporting" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonDiseases.map((disease) => (
                          <SelectItem key={disease} value={disease}>
                            {disease}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of New Cases</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter the number of new cases" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="justify-self-start">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
