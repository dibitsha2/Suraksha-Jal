
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reportSchema = z.object({
  disease: z.string().min(2, 'Disease name is required.'),
  location: z.string().min(3, 'Location is required.'),
  cases: z.coerce.number().min(1, 'Number of cases must be at least 1.'),
  date: z.date({
    required_error: 'A date for the report is required.',
  }),
  severity: z.enum(['low', 'medium', 'high']),
  notes: z.string().optional(),
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
      severity: 'low',
      notes: '',
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
        source: 'Health Worker'
      };
      
      const existingReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
      localStorage.setItem('mockReports', JSON.stringify([newReport, ...existingReports]));

      toast({
        title: 'Report Submitted Successfully',
        description: 'Thank you for your contribution to public health data.',
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
          <CardTitle className="font-headline text-2xl">Official Disease Outbreak Report</CardTitle>
          <CardDescription>
            This form is for authorized health workers to report verified cases or outbreaks.
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
                      <FormLabel>Location (City, State)</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Mumbai, Maharashtra" {...field} className="pl-10" />
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
                      <FormLabel>Number of Verified Cases</FormLabel>
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
                              date > new Date() || date < new Date("2020-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Outbreak Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select the severity level" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Include any additional details, such as water source, patient demographics, etc."
                                className="min-h-[100px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

              <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-bold">Verification Notice</h4>
                    <p className="text-sm">Please ensure all information is accurate and verified. This data directly impacts public health alerts and responses.</p>
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
                    Submit Official Report
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
