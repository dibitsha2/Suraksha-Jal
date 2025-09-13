
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FilePlus, AlertTriangle, Calendar as CalendarIcon, MapPin, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const reportSchema = z.object({
  disease: z.string().min(2, 'Disease name is required.'),
  location: z.string().min(3, 'Location is required.'),
  cases: z.coerce.number().min(1, 'Number of cases must be at least 1.'),
  date: z.date({
    required_error: 'A date for the report is required.',
  }),
});

type ReportValues = z.infer<typeof reportSchema>;

export default function SubmitReportPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      disease: '',
      location: '',
      cases: 1,
      date: new Date(),
    },
  });

  const onSubmit: SubmitHandler<ReportValues> = async (data) => {
    setLoading(true);
    console.log('Submitting report:', data);

    // In a real app, you would send this to a server.
    // Here, we'll just simulate it and add it to local storage.
    try {
      const newReport = {
        ...data,
        id: Date.now(),
        date: format(data.date, 'yyyy-MM-dd'),
      };
      
      const existingReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
      localStorage.setItem('mockReports', JSON.stringify([newReport, ...existingReports]));

      toast({
        title: 'Report Submitted',
        description: 'Thank you for your contribution to public health.',
      });
      form.reset();

    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your report. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Submit Health Report</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Report Disease Outbreak</CardTitle>
          <CardDescription>
            Use this form to report a new waterborne disease case or outbreak in your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="disease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disease Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <BarChart2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Cholera, Typhoid" {...field} className="pl-10" />
                        </div>
                      </FormControl>
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
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="City, State" {...field} className="pl-10" />
                        </div>
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
                      <FormLabel>Number of Cases</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Report</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-bold">Important Note</h4>
                    <p className="text-sm">Please submit accurate information. All reports may be subject to verification by health officials.</p>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
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

    