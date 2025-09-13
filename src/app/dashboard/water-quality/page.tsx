
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Droplet, Thermometer, TestTube, FlaskConical, CheckCircle2, XCircle, Video as VideoIcon } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  checkWaterQuality,
  type WaterQualityOutput,
} from '@/ai/flows/water-quality-checker';
import { useLanguage } from '@/hooks/use-language';
import { VideoDialog } from '@/components/water-filter-video-dialog';

const waterQualitySchema = z.object({
  turbidity: z.coerce.number().min(0, 'Turbidity must be a positive number.'),
  ph: z.coerce.number().min(0, 'pH must be between 0 and 14.').max(14, 'pH must be between 0 and 14.'),
  bacterialPresence: z.enum(['positive', 'negative']),
});

type WaterQualityValues = z.infer<typeof waterQualitySchema>;

export default function WaterQualityPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WaterQualityOutput | null>(null);
  const { t } = useLanguage();

  const form = useForm<WaterQualityValues>({
    resolver: zodResolver(waterQualitySchema),
    defaultValues: {
        bacterialPresence: 'negative'
    },
  });

  const onSubmit: SubmitHandler<WaterQualityValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await checkWaterQuality(data);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing water quality. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('waterQuality')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Water Quality Monitoring</CardTitle>
          <CardDescription>
            Enter the results from your water testing kit or sensor to get an AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="turbidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turbidity (NTU)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="e.g., 0.8" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>pH Level</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.1" placeholder="e.g., 7.2" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bacterialPresence"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bacterial Presence</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <div className="relative">
                            <TestTube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Select bacterial presence result" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="negative">Negative</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="justify-self-start md:col-span-2">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Water Quality
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader className="flex-row gap-4 items-center">
            <AlertTriangle className="text-destructive" />
            <div>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Droplet className="h-5 w-5 text-primary" />
                <span>Water Quality Analysis Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className={result.isSafe ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}>
                <CardHeader className="flex-row items-center gap-4">
                    {result.isSafe ? 
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" /> :
                        <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    }
                    <div className="flex-1">
                        <CardTitle className={result.isSafe ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
                            {result.isSafe ? 'Water is likely safe for consumption' : 'Water is likely unsafe for consumption'}
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>

            <div>
                <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md">
                    <p>{result.analysis}</p>
                </div>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
                 <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <div className="p-4 border rounded-md">
                         <ul className="space-y-3">
                            {result.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                    <Sparkles className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-primary" />
                <span>Detection Tutorial</span>
            </CardTitle>
            <CardDescription>Learn how to detect potential waterborne diseases and contamination.</CardDescription>
        </CardHeader>
        <CardContent>
            <VideoDialog
                trigger={
                    <Button variant="outline">
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Watch Detection Tutorial
                    </Button>
                }
                title="Detection Tutorial"
                description="A guide to detecting waterborne diseases."
                videoUrl="https://www.youtube.com/embed/SVMGEyjmDIw"
            />
        </CardContent>
      </Card>

    </div>
  );
}
