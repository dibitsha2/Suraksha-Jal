
'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, AlertTriangle, Camera, ScanLine, Upload, FileScan, Info, Pill } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  readPrescription,
  type PrescriptionReaderOutput,
} from '@/ai/flows/prescription-reader';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

export default function PrescriptionReaderPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrescriptionReaderOutput | null>(null);
  const { effectiveLanguage } = useLanguage();
  const { toast } = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            setIsCameraOpen(false);
        }
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result as string);
        }
        reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) {
        toast({
            variant: 'destructive',
            title: 'No Image Provided',
            description: 'Please upload or capture an image of the prescription first.',
        });
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await readPrescription({
        prescriptionImage: capturedImage,
        language: effectiveLanguage,
      });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing the prescription. Please ensure the image is clear and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Prescription Reader</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Prescription Reader</CardTitle>
          <CardDescription>
            Upload or take a photo of a doctor's prescription to get a clear, digital version.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Button type="button" variant="outline" className="w-full h-12" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Prescription Image
                 </Button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                 />

                 <Button type="button" variant="outline" className="w-full h-12" onClick={() => setIsCameraOpen(true)}>
                     <Camera className="mr-2 h-5 w-5" />
                     Scan with Camera
                 </Button>
            </div>

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
                <div className="space-y-4 text-center border p-4 rounded-lg">
                     <Image src={capturedImage} alt="Captured prescription" width={400} height={300} className="rounded-md mx-auto" />
                     <p className="text-sm text-muted-foreground">Image ready for analysis.</p>
                     <Button type="button" variant="outline" onClick={() => setCapturedImage(null)}>
                         Clear Image
                     </Button>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            
            <div>
                 <Button type="button" onClick={handleAnalyze} disabled={loading || !capturedImage}>
                    {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                    ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Prescription
                    </>
                    )}
                </Button>
            </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader className="flex-row gap-4 items-center">
            <AlertTriangle className="text-destructive h-6 w-6" />
            <div>
              <CardTitle className="text-destructive">Analysis Failed</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <FileScan className="h-5 w-5 text-primary" />
                <span>Transcribed Prescription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {result.medicines.map((med, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    {med.name}
                  </h3>
                  <div className="mt-2 text-sm text-muted-foreground space-y-1 pl-7">
                     <p><strong>Dosage:</strong> {med.dosage}</p>
                     <p><strong>Frequency:</strong> {med.frequency}</p>
                     {med.instructions && <p><strong>Instructions:</strong> {med.instructions}</p>}
                  </div>
                </Card>
              ))}
               {result.medicines.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                    No medicines could be clearly identified in the prescription. Please try a clearer image.
                </p>
               )}
            </div>
             <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 flex items-start gap-4">
                <Info className="h-6 w-6 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-bold">Disclaimer</h4>
                    <p className="text-sm">{result.disclaimer}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
