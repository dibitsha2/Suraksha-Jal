
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Pill, Mic, Square, Volume2 } from 'lucide-react';

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
import { useLanguage } from '@/hooks/use-language';
import { speechToText } from '@/ai/flows/speech-to-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';

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
  const { effectiveLanguage } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState<Record<string, boolean>>({});

  const form = useForm<SymptomValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: { symptoms: '' },
  });

  const handleStartRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access the microphone. Please check your browser permissions.'});
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setLoading(true);
          try {
            const { transcription } = await speechToText({ audioDataUri: base64Audio });
            const currentSymptoms = form.getValues('symptoms');
            form.setValue('symptoms', currentSymptoms ? `${currentSymptoms} ${transcription}` : transcription);
          } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Transcription Error', description: 'Could not transcribe audio. Please try again.'});
          } finally {
            setLoading(false);
          }
        };
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop media tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handlePlayback = async (id: string, text: string) => {
      setIsSpeaking(prev => ({ ...prev, [id]: true }));
      try {
        const { audioDataUri } = await textToSpeech({ text });
        const audio = new Audio(audioDataUri);
        audio.play();
        audio.onended = () => setIsSpeaking(prev => ({ ...prev, [id]: false }));
      } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Playback Error', description: 'Could not play the audio response.'});
        setIsSpeaking(prev => ({ ...prev, [id]: false }));
      }
  }


  const onSubmit: SubmitHandler<SymptomValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDetailedInfo({});

    try {
      const response = await symptomBasedDiseaseChecker({
        symptoms: data.symptoms,
        location: 'Mumbai, India',
        language: effectiveLanguage,
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
        const response = await getDiseaseInformation({ diseaseName, symptoms, language: effectiveLanguage });
        setDetailedInfo(prev => ({ ...prev, [diseaseName]: { loading: false, data: response }}));
    } catch (e) {
        console.error(e);
        setDetailedInfo(prev => ({ ...prev, [diseaseName]: { loading: false, data: { diseaseInfo: 'Could not fetch detailed information.'}}}));
    }
  }
  
  useEffect(() => {
    return () => {
      // Ensure media stream is stopped on component unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Symptom Checker</CardTitle>
          <CardDescription>
            Describe your symptoms by typing or using your voice. Our AI will provide potential waterborne disease matches and advice.
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
                      <div className="relative">
                        <Textarea
                          placeholder="e.g., I have a high fever, headache, and stomach pain..."
                          className="min-h-[120px] pr-12"
                          {...field}
                        />
                        <div className="absolute top-3 right-3">
                          <Button 
                            type="button" 
                            variant={isRecording ? 'destructive' : 'ghost'} 
                            size="icon" 
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                          >
                            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading || isRecording}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Check Disease
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
                            <div className="prose prose-sm dark:prose-invert mt-4 p-4 border rounded-md relative">
                                <p>{detailedInfo[disease]?.data?.diseaseInfo}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => handlePlayback(`detail-${index}`, detailedInfo[disease]!.data!.diseaseInfo)}
                                  disabled={isSpeaking[`detail-${index}`]}
                                  aria-label="Read details aloud"
                                >
                                    {isSpeaking[`detail-${index}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </div>

            {result.suggestedMedicines && result.suggestedMedicines.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2">Suggested Medicines</h3>
                    <div className="p-4 border rounded-md">
                         <ul className="space-y-3">
                            {result.suggestedMedicines.map((medicine, index) => (
                                <li key={index} className="flex items-start">
                                    <Pill className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{medicine}</span>
                                </li>
                            ))}
                        </ul>
                         <p className="text-xs text-amber-800 dark:text-amber-300 mt-4 p-2 bg-amber-100 dark:bg-amber-900/20 rounded-md"><strong>Important:</strong> Always consult a doctor before taking any new medication. These are only common suggestions and not a prescription.</p>
                    </div>
                </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Recommended Preventive Measures</h3>
                <Button
                    variant="ghost" size="icon"
                    onClick={() => handlePlayback('preventive', result.preventiveMeasures)}
                    disabled={isSpeaking['preventive']}
                    aria-label="Read preventive measures aloud"
                >
                    {isSpeaking['preventive'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.preventiveMeasures}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Additional Information</h3>
                 <Button
                    variant="ghost" size="icon"
                    onClick={() => handlePlayback('additional', result.additionalInformation)}
                    disabled={isSpeaking['additional']}
                    aria-label="Read additional information aloud"
                >
                    {isSpeaking['additional'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
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
