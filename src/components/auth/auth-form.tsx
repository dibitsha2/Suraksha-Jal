
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
  KeyRound,
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

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const healthWorkerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
    workerId: z.string().min(1, 'Worker ID is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits.'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


type LoginValues = z.infer<typeof loginSchema>;
type HealthWorkerLoginValues = z.infer<typeof healthWorkerLoginSchema>;
type UserRegisterValues = z.infer<typeof userRegisterSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type UserType = 'user' | 'health-worker';
type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';


// Main Component
export default function AuthForm({ initialTab = 'login', userType = 'user' }: { initialTab?: 'login' | 'register', userType: UserType }) {
  const [currentView, setCurrentView] = useState<AuthView>(initialTab);
  const [resetEmail, setResetEmail] = useState<string>('');

  const redirectUrl = userType === 'health-worker' ? '/dashboard-health-worker' : '/dashboard';

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return userType === 'user' ? 
          <LoginForm redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} /> :
          <HealthWorkerLoginForm redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} />;
      case 'register':
        return userType === 'user' ? (
          <UserRegisterForm redirectUrl={redirectUrl} />
        ) : (
          <HealthWorkerRegisterForm redirectUrl={redirectUrl} />
        );
      case 'forgot-password':
          return <ForgotPasswordForm onEmailSubmitted={(email) => { setResetEmail(email); setCurrentView('reset-password'); }} onBackToLogin={() => setCurrentView('login')} />;
      case 'reset-password':
          return <ResetPasswordForm email={resetEmail} onPasswordReset={() => setCurrentView('login')} onBackToLogin={() => setCurrentView('login')} />;
      default:
         return userType === 'user' ? 
          <LoginForm redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} /> :
          <HealthWorkerLoginForm redirectUrl={redirectUrl} onForgotPassword={() => setCurrentView('forgot-password')} />;
    }
  }
  
  const handleTabChange = (tab: string) => {
    setCurrentView(tab as AuthView);
  }

  return (
    <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
        {currentView !== 'forgot-password' && currentView !== 'reset-password' && (
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
function LoginForm({ redirectUrl, onForgotPassword }: { redirectUrl: string, onForgotPassword: () => void }) {
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
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const existingProfile = allProfiles[data.email];

        if (!existingProfile) {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'This email is not registered. Please create an account.',
             });
             setLoading(false);
             return;
        }

        if (existingProfile.role === 'health-worker') {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'This is a health worker account. Please use the health worker portal.',
            });
            setLoading(false);
            return;
        }

        if (existingProfile.password !== data.password) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Incorrect password. Please try again.',
            });
            setLoading(false);
            return;
        }

        localStorage.setItem('userProfile', JSON.stringify(existingProfile));
        
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

function HealthWorkerLoginForm({ redirectUrl, onForgotPassword }: { redirectUrl: string, onForgotPassword: () => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<HealthWorkerLoginValues>({
    resolver: zodResolver(healthWorkerLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<HealthWorkerLoginValues> = async (data) => {
    setLoading(true);
    try {
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const existingProfile = allProfiles[data.email];

        if (!existingProfile) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'This email is not registered. Please create an account.',
            });
            setLoading(false);
            return;
        }
        
        if (existingProfile?.role !== 'health-worker') {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'This account is not registered as a health worker. Please use the general user portal.',
            });
            setLoading(false);
            return;
        }

        if (existingProfile.password !== data.password) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Incorrect password. Please try again.',
            });
            setLoading(false);
            return;
        }
        
        localStorage.setItem('userProfile', JSON.stringify(existingProfile));

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
    const form = useForm<UserRegisterValues>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '' },
    });

    const onSubmit: SubmitHandler<UserRegisterValues> = async (data) => {
        try {
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            if (allProfiles[data.email]) {
                toast({
                    variant: 'destructive',
                    title: 'Registration Failed',
                    description: 'This email is already registered. Please log in.',
                });
                return;
            }

            const profile = {
                name: data.username,
                email: data.email,
                address: data.address,
                password: data.password, // Storing password in localStorage is not secure, for demo only
                role: 'user',
            };
            
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
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            if (allProfiles[data.email]) {
                toast({
                    variant: 'destructive',
                    title: 'Registration Failed',
                    description: 'This email is already registered. Please log in.',
                });
                return;
            }

            const profile = {
                name: data.username,
                email: data.email,
                workerId: data.workerId,
                password: data.password,
                role: 'health-worker', // Assign role
            };
            
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

function ForgotPasswordForm({ onEmailSubmitted, onBackToLogin }: { onEmailSubmitted: (email: string) => void, onBackToLogin: () => void }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit: SubmitHandler<ForgotPasswordValues> = async (data) => {
        setLoading(true);
        try {
            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            if (!allProfiles[data.email]) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'No account found with this email address.',
                });
                return;
            }
            // Simulate sending OTP
            toast({
                title: 'OTP Sent',
                description: `An OTP has been "sent" to ${data.email}. (For demo, use 123456)`,
            });
            onEmailSubmitted(data.email);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-t-0 rounded-t-none">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a one-time password (OTP).</CardDescription>
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
                            Send OTP
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

function ResetPasswordForm({ email, onPasswordReset, onBackToLogin }: { email: string, onPasswordReset: () => void, onBackToLogin: () => void }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
    });

    const onSubmit: SubmitHandler<ResetPasswordValues> = async (data) => {
        setLoading(true);
        try {
            // Simulate OTP verification
            if (data.otp !== '123456') {
                toast({
                    variant: 'destructive',
                    title: 'Invalid OTP',
                    description: 'The OTP you entered is incorrect. Please try again.',
                });
                return;
            }

            const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            if (allProfiles[email]) {
                allProfiles[email].password = data.newPassword;
                localStorage.setItem('userProfiles', JSON.stringify(allProfiles));

                toast({
                    title: 'Password Reset Successful',
                    description: 'You can now log in with your new password.',
                });
                onPasswordReset();
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An unexpected error occurred. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-t-0 rounded-t-none">
            <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>Enter the OTP sent to {email} and set a new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>One-Time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="123456" {...field} className="pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
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
                            Reset Password
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

    