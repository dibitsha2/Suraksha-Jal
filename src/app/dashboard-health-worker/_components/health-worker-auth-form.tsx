
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
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const healthWorkerRegisterSchema = z.object({
    username: z.string().min(2, 'Username is too short'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address is too short'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});


type LoginValues = z.infer<typeof loginSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;


// Main Component
export default function HealthWorkerAuthForm({ initialTab = 'login' }: { initialTab?: 'login' | 'register' }) {
  return (
    <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
            <LoginForm />
        </TabsContent>
        <TabsContent value="register">
            <HealthWorkerRegisterForm />
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
        
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const userProfile = allProfiles[user.email!];
        
        if (!userProfile || !userProfile.isHealthWorker) {
            await auth.signOut();
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'This email is not registered as a health worker.',
            });
            setLoading(false);
            return;
        }

        const updatedProfile = {
            ...userProfile,
            name: userProfile?.name || user.displayName,
            email: user.email,
            photoURL: userProfile?.photoURL || user.photoURL,
        };

        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        allProfiles[user.email!] = updatedProfile;
        localStorage.setItem('userProfiles', JSON.stringify(allProfiles));


        toast({
          title: 'Login Successful',
          description: 'Redirecting to health worker dashboard...',
        });

        router.push('/dashboard-health-worker');

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
    <Card className="border-t-0 rounded-t-none">
      <CardHeader>
        <CardTitle>Health Worker Login</CardTitle>
        <CardDescription>Enter your credentials to access the health worker portal.</CardDescription>
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
              Sign In as Health Worker
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
    
    const form = useForm<HealthWorkerRegisterValues>({
        resolver: zodResolver(healthWorkerRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '' },
    });

    const onSubmit: SubmitHandler<HealthWorkerRegisterValues> = async (data) => {
        form.formState.isSubmitting = true;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data.username });
            
            const profile = {
                name: data.username,
                email: data.email,
                address: data.address,
                isHealthWorker: true,
                photoURL: ''
            };
            
            localStorage.setItem('userProfile', JSON.stringify(profile));
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            allProfiles[data.email] = profile;
            localStorage.setItem('userProfiles', JSON.stringify(allProfiles));

            toast({
                title: 'Registration Successful',
                description: 'Your health worker account has been created.',
            });
            router.push('/dashboard-health-worker');
        } catch (error: any) {
             console.error('Health worker registration error:', error);
             let description = 'An unexpected error occurred. Please try again.';
             if (error.code === 'auth/email-already-in-use') {
                 description = 'This email is already registered as a health worker. Please try logging in.';
             }
             toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description,
            });
        } finally {
            form.formState.isSubmitting = false;
        }
    };

    return (
        <Card className="border-t-0 rounded-t-none">
            <CardHeader>
                <CardTitle>Health Worker Registration</CardTitle>
                <CardDescription>Create your health worker account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Health Worker Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
