
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Pill, Info } from 'lucide-react';

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
  getMedicineInformation,
  type MedicineInformationOutput,
} from '@/ai/flows/medicine-checker';
import { useLanguage } from '@/hooks/use-language';

const medicineSchema = z.object({
  medicineName: z.string().min(2, 'Please enter a valid medicine name.'),
});

type MedicineValues = z.infer<typeof medicineSchema>;

const commonMedicines = [
    'Paracetamol',
    'Ibuprofen',
    'Aspirin',
    'Cetirizine',
    'Loratadine',
    'Diphenhydramine',
    'Ranitidine',
    'Omeprazole',
    'Loperamide',
    'Oral Rehydration Salts (ORS)',
];

export default function MedicineCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MedicineInformationOutput | null>(null);
  const { t, effectiveLanguage } = useLanguage();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);


  const form = useForm<MedicineValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: { medicineName: '' },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('medicineName', value);
    if (value.length > 0) {
      const filteredSuggestions = commonMedicines.filter((med) =>
        med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (medicine: string) => {
    form.setValue('medicineName', medicine, { shouldValidate: true });
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };


  const onSubmit: SubmitHandler<MedicineValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setIsSuggestionsVisible(false);

    try {
      const response = await getMedicineInformation({
        medicineName: data.medicineName,
        language: effectiveLanguage,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while getting information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('medicineChecker')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Medicine Checker</CardTitle>
          <CardDescription>
            Enter the name of a medicine to learn what it's used for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="medicineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="e.g., Paracetamol" 
                                {...field} 
                                className="pl-10" 
                                onChange={handleInputChange}
                                onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 150)}
                                autoComplete="off"
                            />
                             {isSuggestionsVisible && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                                    <ul className="py-1">
                                    {suggestions.map((medicine, index) => (
                                        <li
                                            key={index}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                                            onClick={() => handleSuggestionClick(medicine)}
                                        >
                                            {medicine}
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="justify-self-start">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Information
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
                <Info className="h-5 w-5 text-primary" />
                <span>Medicine Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md">
                <p>{result.usageInfo}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
