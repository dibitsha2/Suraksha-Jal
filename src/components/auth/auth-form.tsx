
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  FileCheck2,
  FileX2,
  Loader2,
  Mail,
  MapPin,
  Camera,
  User,
  Lock,
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { verifyHealthWorkerId } from '@/ai/flows/health-worker-id-verification';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const userRegisterSchema = z.object({
  username: z.string().min(2, 'Username is too short'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const healthWorkerRegisterSchema = userRegisterSchema.extend({
    faceId: z.string().min(1, 'Face ID capture is required.'),
});


type LoginValues = z.infer<typeof loginSchema>;
type UserRegisterValues = z.infer<typeof userRegisterSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;


// Main Component
export default function AuthForm() {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}

// Login Form Component
function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginValues> = async (data) => {
    setLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        let profile: any = {};
        const existingProfile = localStorage.getItem('userProfile');
        if (existingProfile) {
            try {
                profile = JSON.parse(existingProfile);
            } catch (e) {
                console.error("Error parsing user profile from local storage", e);
            }
        }
        
        const updatedProfile = {
            ...profile,
            name: profile.name || user.displayName,
            email: user.email,
            photoURL: profile.photoURL || user.photoURL,
        };

        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        router.push('/dashboard');
    } catch (error: any) {
        console.error('Login error:', error);
        let description = 'An unexpected error occurred.';
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                description = 'Invalid email or password. Please try again.';
                break;
            case 'auth/invalid-email':
                description = 'The email address you entered is not valid.';
                break;
            case 'auth/too-many-requests':
                description = 'Too many login attempts. Please try again later.';
                break;
            case 'auth/operation-not-allowed':
                description = 'Email/Password sign-in is not enabled. Please contact an administrator.';
                break;
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: description,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="your.email@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Register Form Component
function RegisterForm() {
    const [activeTab, setActiveTab] = useState('user');

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">General User</TabsTrigger>
                <TabsTrigger value="health-worker">Health Worker</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
                <UserRegisterForm />
            </TabsContent>
            <TabsContent value="health-worker">
                <HealthWorkerRegisterForm />
            </TabsContent>
        </Tabs>
    );
}

function UserRegisterForm() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<UserRegisterValues>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '' },
    });

    const onSubmit: SubmitHandler<UserRegisterValues> = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data.username });

            const profile = {
                name: data.username,
                email: data.email,
                address: data.address,
                age: undefined,
                weight: undefined,
                height: undefined,
                bloodGroup: undefined,
            };
            localStorage.setItem('userProfile', JSON.stringify(profile));

            toast({
                title: 'Registration Successful',
                description: "You have been logged in automatically.",
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Registration error:', error);
            let description = 'An unexpected error occurred.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'This email is already registered. Please try logging in.';
            } else if (error.code === 'auth/weak-password') {
                description = 'The password is too weak. Please use at least 8 characters.';
            }
             toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join our community to stay informed.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="your_username" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="your.email@example.com" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Your city, state" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="password" placeholder="Choose a strong password" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function HealthWorkerRegisterForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [idStatus, setIdStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
    const [verificationReason, setVerificationReason] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const form = useForm<HealthWorkerRegisterValues>({
        resolver: zodResolver(healthWorkerRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '', faceId: '' },
    });

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this app.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [toast]);


    const handleCaptureAndVerify = async () => {
        if (videoRef.current && canvasRef.current) {
            setIdStatus('verifying');
            setVerificationReason('');

            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUri = canvas.toDataURL('image/jpeg');
                form.setValue('faceId', dataUri);
                
                try {
                    const result = await verifyHealthWorkerId({ idDataUri: dataUri });
                    if (result.isValid) {
                        setIdStatus('valid');
                    } else {
                        setIdStatus('invalid');
                        setVerificationReason(result.reason || 'The captured face could not be verified.');
                        form.setValue('faceId', ''); // Clear invalid data
                    }
                } catch (error) {
                    console.error("Face verification error:", error);
                    setIdStatus('invalid');
                    setVerificationReason('An error occurred during verification. Please try again.');
                    form.setValue('faceId', ''); // Clear invalid data
                }
            }
        }
    };

    const onSubmit: SubmitHandler<HealthWorkerRegisterValues> = async (data) => {
        if (idStatus !== 'valid') {
            toast({
                variant: 'destructive',
                title: 'Face Not Verified',
                description: 'Please capture and verify your face before registering.',
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data.username });
            
            const profile = {
                name: data.username,
                email: data.email,
                address: data.address,
                isHealthWorker: true,
                photoURL: data.faceId // Save face capture as profile picture
            };
            localStorage.setItem('userProfile', JSON.stringify(profile));

            toast({
                title: 'Registration Successful',
                description: 'Your health worker account has been created.',
            });
            router.push('/dashboard');
        } catch (error: any) {
             console.error('Health worker registration error:', error);
             toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: 'An unexpected error occurred. Please try again.',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Worker Registration</CardTitle>
                <CardDescription>Verify your face to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Basic fields */}
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem><FormLabel>Username</FormLabel><FormControl><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="your_username" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                           <FormItem><FormLabel>Email</FormLabel><FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="your.email@example.com" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Your city, state" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                           <FormItem><FormLabel>Password</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Choose a strong password" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        {/* Face ID Field */}
                        <FormField
                            control={form.control}
                            name="faceId"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Face Verification</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                                <canvas ref={canvasRef} className="hidden" />
                                                {hasCameraPermission === false && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                                                        <Camera className="h-10 w-10 mb-2" />
                                                        <p className="text-center font-semibold">Camera access is required for verification.</p>
                                                        <p className="text-center text-sm">Please allow camera access in your browser settings.</p>
                                                    </div>
                                                )}
                                            </div>
                                            <Button type="button" onClick={handleCaptureAndVerify} disabled={idStatus === 'verifying' || hasCameraPermission !== true}>
                                                {idStatus === 'verifying' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                                                {idStatus === 'valid' ? 'Re-capture' : 'Capture & Verify'}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Verification Status */}
                         {idStatus !== 'idle' && (
                            <div className="p-3 rounded-md flex items-center gap-3 text-sm
                                bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 data-[status=valid]:bg-green-100 data-[status=valid]:dark:bg-green-900/20 data-[status=valid]:text-green-800 data-[status=valid]:dark:text-green-300
                                data-[status=invalid]:bg-red-100 data-[status=invalid]:dark:bg-red-900/20 data-[status=invalid]:text-red-800 data-[status=invalid]:dark:text-red-300"
                                data-status={idStatus}
                            >
                                {idStatus === 'verifying' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {idStatus === 'valid' && <FileCheck2 className="h-4 w-4" />}
                                {idStatus === 'invalid' && <FileX2 className="h-4 w-4" />}
                                <div>
                                    {idStatus === 'verifying' && 'Verifying your face, please wait...'}
                                    {idStatus === 'valid' && 'Face verified successfully!'}
                                    {idStatus === 'invalid' && `Verification Failed: ${verificationReason}`}
                                </div>
                            </div>
                        )}
                        
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || idStatus !== 'valid'}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Health Worker Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

    