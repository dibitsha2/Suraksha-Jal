
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Mail,
  User,
  Lock,
  Briefcase,
  KeyRound,
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
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

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  username: z.string().min(2, 'Username is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const healthWorkerRegisterSchema = z.object({
    username: z.string().min(2, 'Username is too short'),
    email: z.string().email('Invalid email address'),
    workerId: z.string().min(1, 'Worker ID is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});


type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

type UserType = 'user' | 'health-worker';
type AuthView = 'login' | 'register' | 'forgot-password';


// Main Component
export default function AuthForm({ initialTab = 'login', userType = 'user' }: { initialTab?: 'login' | 'register', userType: UserType }) {
  const [currentView, setCurrentView] = useState<AuthView>(initialTab);

  const redirectUrl = userType === 'health-worker' ? '/dashboard-health-worker' : '/dashboard';

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm userType={userType} redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} />;
      case 'register':
        return userType === 'user' ? (
          <UserRegisterForm redirectUrl={redirectUrl} />
        ) : (
          <HealthWorkerRegisterForm redirectUrl={redirectUrl} />
        );
      case 'forgot-password':
          return <ForgotPasswordForm onBackToLogin={() => setCurrentView('login')} />;
      default:
         return <LoginForm userType={userType} redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} />;
    }
  }
  
  const handleTabChange = (tab: string) => {
    setCurrentView(tab as AuthView);
  }

  return (
    <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
        {currentView !== 'forgot-password' && (
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
        )}
      {renderContent()}
    </Tabs>
  );
}

// Login Form Component
function LoginForm({ userType, redirectUrl, onForgotPassword }: { userType: UserType, redirectUrl: string, onForgotPassword: () => void }) {
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
        await signInWithEmailAndPassword(auth, data.email, data.password);
        
        toast({
          title: 'Login Successful',
          description: 'Redirecting...',
        });

        router.push(redirectUrl);

    } catch (error: any) {
        console.error('Login error:', error);
        let description = 'An unexpected error occurred.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            description = 'Invalid email or password. Please try again.';
        } else if (error.code === 'auth/invalid-credential') {
             description = 'Invalid credentials. Please check your email and password.';
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
             <div className="text-right">
              <Button type="button" variant="link" size="sm" className="p-0 h-auto" onClick={onForgotPassword}>
                Forgot Password?
              </Button>
            </div>
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
    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: '', email: '', password: '' },
    });

    const onSubmit: SubmitHandler<RegisterValues> = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            
            await updateProfile(userCredential.user, {
                displayName: data.username
            });

            toast({
                title: 'Registration Successful',
                description: "You have been logged in automatically.",
            });
            router.push(redirectUrl);

        } catch (error: any) {
            console.error('Registration error:', error);
            let description = 'An unexpected error occurred.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'This email is already registered. Please log in.';
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
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            
            await updateProfile(userCredential.user, {
                displayName: data.username
            });

            // In a real app, you'd store the workerId and role in a database (e.g., Firestore)
            // associated with the user's UID (userCredential.user.uid).
            
            toast({
                title: 'Registration Successful',
                description: "Please log in to continue.",
            });
            router.push('/health-worker/login');

        } catch (error: any) {
            console.error('Registration error:', error);
            let description = 'An unexpected error occurred.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'This email is already registered. Please log in.';
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
                                <FormLabel>Health Worker ID</FormLabel>
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

function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit: SubmitHandler<ForgotPasswordValues> = async (data) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast({
                title: 'Password Reset Email Sent',
                description: `If an account exists for ${data.email}, you will receive an email with instructions to reset your password.`,
            });
            onBackToLogin();
        } catch(error: any) {
            console.error("Forgot password error:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not send password reset email. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-t-0 rounded-t-none">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link.</CardDescription>
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                        <Button type="button" variant="link" className="w-full" onClick={onBackToLogin}>
                            Back to Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

    