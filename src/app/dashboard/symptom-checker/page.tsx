'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  symptomBasedDiseaseChecker,
  type SymptomBasedDiseaseCheckerOutput,
} from '@/ai/flows/symptom-based-disease-checker';
import { getDiseaseInformation, type DiseaseInformationOutput } from '@/ai/flows/ai-powered-disease-information';

const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

type SymptomValues = z.infer<typeof symptomSchema>;

type DetailedInfoState = {
    [key: string]: {
        loading: boolean;
        data: DiseaseInformationOutput | null;
    }
}

export default function SymptomCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomBasedDiseaseCheckerOutput | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<DetailedInfoState>({});

  const form = useForm<SymptomValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: { symptoms: '' },
  });

  const onSubmit: SubmitHandler<SymptomValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDetailedInfo({});

    try {
      // For location, we would normally use navigator.geolocation
      // but for this example, we'll pass a mock location.
      const response = await symptomBasedDiseaseChecker({
        symptoms: data.symptoms,
        location: 'Mumbai, India', // Mock location
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while checking symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDetailedInfo = async (diseaseName: string, symptoms: string) => {
    setDetailedInfo(prev => ({ ...prev, [diseaseName]: { loading: true, data: null }}));
    try {
        const response = await getDiseaseInformation({ diseaseName, symptoms });
        setDetailedInfo(prev => ({ ...prev, [diseaseName]: { loading: false, data: response }}));
    } catch (e) {
        console.error(e);
        setDetailedInfo(prev => ({ ...prev, [diseaseName]: { loading: false, data: { diseaseInfo: 'Could not fetch detailed information.'}}}));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Symptom Checker</CardTitle>
          <CardDescription>
            Describe your symptoms below, and our AI will provide potential waterborne disease matches and advice.
            This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a high fever, headache, and stomach pain..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Check Symptoms
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
            <CardTitle className="font-headline text-xl">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Potential Disease Matches</h3>
              <p className="text-sm text-muted-foreground">Based on your symptoms, here are some possibilities. Click on each for more information.</p>
                <Accordion type="single" collapsible className="w-full mt-4">
                  {result.diseaseMatches.map((disease, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{disease}</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Click the button below to get AI-powered details about this disease.</p>
                         <Button variant="outline" size="sm" onClick={() => fetchDetailedInfo(disease, form.getValues('symptoms'))} disabled={detailedInfo[disease]?.loading}>
                            {detailedInfo[disease]?.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Get More Information
                        </Button>
                        {detailedInfo[disease]?.data && (
                            <div className="prose prose-sm dark:prose-invert mt-4 p-4 border rounded-md">
                                <p>{detailedInfo[disease]?.data?.diseaseInfo}</p>
                            </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recommended Preventive Measures</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.preventiveMeasures}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.additionalInformation}</p>
            </div>
            
            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300">
                <p className="text-sm font-medium"><strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute medical advice. Please consult a healthcare professional for an accurate diagnosis and treatment plan.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
