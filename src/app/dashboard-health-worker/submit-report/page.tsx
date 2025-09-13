
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const reportSchema = z.object({
    disease: z.string().min(1, "Please select a disease."),
    location: z.string().min(3, "Please enter a location."),
    cases: z.coerce.number().min(1, "Number of cases must be at least 1."),
});

type ReportValues = z.infer<typeof reportSchema>;

const commonDiseases = [
    'Cholera',
    'Typhoid',
    'Hepatitis A',
    'Giardiasis',
    'Dysentery',
    'Leptospirosis',
    'Cryptosporidiosis',
];

export default function SubmitReportPage() {
    const { toast } = useToast();
    const form = useForm<ReportValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            disease: '',
            location: '',
        },
    });

    const onSubmit = async (data: ReportValues) => {
        // In a real application, you would send this data to your backend
        // For now, we'll just simulate a successful submission with a toast.
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Report Submitted",
            description: `Successfully submitted a report for ${data.cases} case(s) of ${data.disease} in ${data.location}.`,
        });
        form.reset();
    };

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Submit New Report</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Report Disease Outbreak</CardTitle>
                    <CardDescription>
                        Fill out the form below to report new cases of waterborne diseases in your area. This data is vital for public health.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
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
                                                {commonDiseases.map(disease => (
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
                                        <FormLabel>Location (City, State)</FormLabel>
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
                                        <FormLabel>Number of Confirmed Cases</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
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
