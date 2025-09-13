
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Mail,
  MapPin,
  User,
  Lock,
  Briefcase,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Link from 'next/link';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
});

const userRegisterSchema = z.object({
  username: z.string().min(2, 'Username is too short'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const healthWorkerRegisterSchema = z.object({
    username: z.string().min(2, 'Username is too short'),
    email: z.string().email('Invalid email address'),
    workerId: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});


type LoginValues = z.infer<typeof loginSchema>;
type UserRegisterValues = z.infer<typeof userRegisterSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;

type UserType = 'user' | 'health-worker';


// Main Component
export default function AuthForm({ initialTab = 'login', userType = 'user' }: { initialTab?: 'login' | 'register', userType: UserType }) {
  
  const redirectUrl = userType === 'health-worker' ? '/dashboard-health-worker' : '/dashboard';

  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm redirectUrl={redirectUrl} userType={userType} />
      </TabsContent>
      <TabsContent value="register">
        {userType === 'user' ? (
            <UserRegisterForm redirectUrl={redirectUrl} />
        ) : (
            <HealthWorkerRegisterForm redirectUrl={redirectUrl} />
        )}
      </TabsContent>
    </Tabs>
  );
}

// Login Form Component
function LoginForm({ redirectUrl, userType }: { redirectUrl: string, userType: UserType }) {
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
        // Simplified login for demo
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        let existingProfile = allProfiles[data.email];

        if (!existingProfile) {
            existingProfile = {
                name: data.email.split('@')[0],
                email: data.email,
                role: userType,
            };
        }
        
        // IMPORTANT: Check if the user role matches the portal type
        if (userType === 'health-worker' && existingProfile?.role !== 'health-worker') {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'This account is not registered as a health worker. Please use the general user portal.',
            });
            setLoading(false);
            return;
        }
         if (userType === 'user' && existingProfile?.role === 'health-worker') {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'This is a health worker account. Please use the health worker portal.',
            });
            setLoading(false);
            return;
        }

        const updatedProfile = {
            ...existingProfile,
            name: existingProfile.name || data.email.split('@')[0],
            email: data.email,
        };

        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        allProfiles[data.email] = updatedProfile;
        localStorage.setItem('userProfiles', JSON.stringify(allProfiles));


        toast({
          title: 'Login Successful',
          description: 'Redirecting...',
        });

        router.push(redirectUrl);

    } catch (error: any) {
        console.error('Login error:', error);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'An unexpected error occurred.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="border-t-0 rounded-t-none">
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
                  <FormLabel>Password (optional)</FormLabel>
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


function UserRegisterForm({ redirectUrl }: { redirectUrl: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<UserRegisterValues>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '' },
    });

    const onSubmit: SubmitHandler<UserRegisterValues> = async (data) => {
        try {
            const profile = {
                name: data.username,
                email: data.email,
                address: data.address,
                role: 'user',
            };
            
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            allProfiles[data.email] = profile;
            localStorage.setItem('userProfiles', JSON.stringify(allProfiles));
            
            localStorage.setItem('userProfile', JSON.stringify(profile));
            toast({
                title: 'Registration Successful',
                description: "You have been logged in automatically.",
            });
            router.push(redirectUrl);

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
        <Card className="border-t-0 rounded-t-none">
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

function HealthWorkerRegisterForm({ redirectUrl }: { redirectUrl: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<HealthWorkerRegisterValues>({
        resolver: zodResolver(healthWorkerRegisterSchema),
        defaultValues: { username: '', email: '', workerId: '', password: '' },
    });

    const onSubmit: SubmitHandler<HealthWorkerRegisterValues> = async (data) => {
        try {
            const profile = {
                name: data.username,
                email: data.email,
                workerId: data.workerId,
                role: 'health-worker', // Assign role
            };
            
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            allProfiles[data.email] = profile;
            localStorage.setItem('userProfiles', JSON.stringify(allProfiles));
            
            toast({
                title: 'Registration Successful',
                description: "Please log in to continue.",
            });
            router.push('/health-worker/login');

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
        <Card className="border-t-0 rounded-t-none">
            <CardHeader>
                <CardTitle>Health Worker Registration</CardTitle>
                <CardDescription>Create a professional account to submit reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Your full name" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Official Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="your.official@email.gov" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="workerId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Health Worker ID (optional)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Your official ID number" {...field} className="pl-10" />
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
