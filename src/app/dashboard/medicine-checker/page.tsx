
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, Pill, Info, Camera, Video, ScanLine, Volume2 } from 'lucide-react';

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
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

const medicineSchema = z.object({
  medicineName: z.string().optional(),
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
    'Amoxicillin',
    'Azithromycin',
    'Metformin',
    'Atorvastatin',
    'Amlodipine',
    'Lisinopril',
    'Salbutamol',
    'Montelukast',
    'Furosemide',
    'Gabapentin',
    'Sertraline',
    'Escitalopram',
    'Fluoxetine',
    'Ciprofloxacin',
    'Metronidazole',
    'Doxycycline',
    'Prednisone',
    'Tramadol',
    'Diclofenac',
    'Simvastatin',
    'Levothyroxine',
];

export default function MedicineCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MedicineInformationOutput | null>(null);
  const { t, effectiveLanguage } = useLanguage();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const { toast } = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [resultFromImage, setResultFromImage] = useState(false);


  const form = useForm<MedicineValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: { medicineName: '' },
  });
  
  useEffect(() => {
    if (isCameraOpen) {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }});
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            setIsCameraOpen(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
        getCameraPermission();
    } else {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isCameraOpen, toast]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            setIsCameraOpen(false); // Close camera after capture
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('medicineName', value);
    if (value.length > 0) {
      setCapturedImage(null); // Clear image if user types
      setResultFromImage(false);
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
    if (!data.medicineName && !capturedImage) {
        toast({
            variant: 'destructive',
            title: 'Input Required',
            description: 'Please enter a medicine name or scan an image.',
        });
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setIsSuggestionsVisible(false);
    setResultFromImage(!!capturedImage);

    try {
      const response = await getMedicineInformation({
        medicineName: data.medicineName,
        image: capturedImage ?? undefined,
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
  
  const handlePlayback = async (text: string) => {
      setIsSpeaking(true);
      try {
        const { audioDataUri } = await textToSpeech({ text });
        const audio = new Audio(audioDataUri);
        audio.play();
        audio.onended = () => setIsSpeaking(false);
      } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Playback Error', description: 'Could not play the audio response.'});
        setIsSpeaking(false);
      }
  }


  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('medicineChecker')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Medicine Checker</CardTitle>
          <CardDescription>
            Enter the name of a medicine or scan it with your camera to learn what it's used for.
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

            <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <div className="space-y-4">
                 {!isCameraOpen && !capturedImage && (
                     <Button type="button" variant="outline" className="w-full" onClick={() => setIsCameraOpen(true)}>
                         <Camera className="mr-2" />
                         Scan with Camera
                     </Button>
                 )}

                {isCameraOpen && (
                    <div className="space-y-4">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                             <Alert variant="destructive">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>Please allow camera access in your browser settings to use this feature.</AlertDescription>
                            </Alert>
                        )}
                         <div className="flex gap-4">
                            <Button type="button" className="w-full" onClick={handleCapture} disabled={hasCameraPermission === false}>
                                <ScanLine className="mr-2" />
                                Capture
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setIsCameraOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                )}
                
                {capturedImage && (
                    <div className="space-y-4 text-center">
                         <Image src={capturedImage} alt="Captured medicine" width={400} height={300} className="rounded-md mx-auto" />
                         <p className="text-sm text-muted-foreground">Image captured. Click "Get Information" to analyze.</p>
                         <Button type="button" variant="outline" onClick={() => { setCapturedImage(null); setResultFromImage(false); form.setValue('medicineName', ''); }}>
                             Retake or Type
                         </Button>
                    </div>
                )}
                 <canvas ref={canvasRef} className="hidden" />
            </div>

              <Button type="submit" disabled={loading} className="justify-self-start mt-4">
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
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md relative">
                <p>{result.usageInfo}</p>
                {resultFromImage && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handlePlayback(result.usageInfo)}
                        disabled={isSpeaking}
                        aria-label="Read details aloud"
                    >
                        {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
