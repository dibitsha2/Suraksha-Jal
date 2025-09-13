'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Languages, ArrowRightLeft } from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  translateText,
  type TranslateTextOutput,
} from '@/ai/flows/translate-text';
import { useLanguage } from '@/hooks/use-language';
import { languages } from '@/lib/translations';

const translateSchema = z.object({
  text: z.string().min(1, 'Please enter some text to translate.'),
  targetLanguage: z.string({ required_error: 'Please select a language.'}),
});

type TranslateValues = z.infer<typeof translateSchema>;

export default function TranslatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateTextOutput | null>(null);
  const { t } = useLanguage();

  const form = useForm<TranslateValues>({
    resolver: zodResolver(translateSchema),
    defaultValues: { text: '' },
  });

  const onSubmit: SubmitHandler<TranslateValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await translateText(data);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred during translation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('translator')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Text Translator</CardTitle>
          <CardDescription>
            Translate text into any supported language using the power of AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Translate</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the text you want to translate..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translate To</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a target language" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang.code} value={lang.name}>{lang.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="justify-self-start">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Translate Text
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
                <Languages className="h-5 w-5 text-primary" />
                <span>Translation Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted/50">
                <p>{result.translatedText}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
