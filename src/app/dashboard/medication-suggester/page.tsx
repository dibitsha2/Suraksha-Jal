
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Pill, Home, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  getMedicationSuggestions,
  type MedicationSuggesterOutput,
} from '@/ai/flows/medication-suggester';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';

const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
  age: z.coerce.number().min(1, 'Age must be 1 or greater').optional(),
});

type SymptomValues = z.infer<typeof symptomSchema>;

export default function MedicationSuggesterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MedicationSuggesterOutput | null>(null);
  const { t, effectiveLanguage } = useLanguage();

  const form = useForm<SymptomValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: { symptoms: '' },
  });

  useEffect(() => {
    try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            if (profile.age) {
                form.setValue('age', profile.age);
            }
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }
  }, [form]);

  const onSubmit: SubmitHandler<SymptomValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getMedicationSuggestions({
        symptoms: data.symptoms,
        age: data.age,
        language: effectiveLanguage,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while getting suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('medicationSuggester')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Medication Suggester</CardTitle>
          <CardDescription>
            Describe your symptoms, and our AI will suggest common medications and home remedies.
            This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Age (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your age for better suggestions" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a cough, sore throat, and a slight fever..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="justify-self-start">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Suggestions
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
            <CardTitle className="font-headline text-xl">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.suggestedMedicines && result.suggestedMedicines.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        <span>Suggested Over-the-Counter Medicines</span>
                    </h3>
                    <div className="p-4 border rounded-md">
                         <ul className="space-y-4">
                            {result.suggestedMedicines.map((medicine, index) => (
                                <li key={index} className="flex flex-col items-start gap-2">
                                    <div className="flex items-center gap-3">
                                        <Pill className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="font-medium">{medicine.name}</span>
                                    </div>
                                    {medicine.contraindications.length > 0 && (
                                        <div className="pl-8">
                                            <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
                                                <ShieldAlert className="h-3.5 w-3.5" />
                                                Use with caution if you have:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {medicine.contraindications.map((ci, ciIndex) => (
                                                    <Badge key={ciIndex} variant="outline" className="text-xs font-normal border-amber-500 text-amber-700 dark:text-amber-400">
                                                        {ci}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {result.homeRemedies && result.homeRemedies.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        <span>Suggested Home Remedies</span>
                    </h3>
                    <div className="p-4 border rounded-md">
                         <ul className="space-y-3">
                            {result.homeRemedies.map((remedy, index) => (
                                <li key={index} className="flex items-start">
                                    <Home className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{remedy}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300">
                <p className="text-sm font-medium"><strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute medical advice. Please consult a healthcare professional for an accurate diagnosis and treatment plan before taking any medication or trying home remedies.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
