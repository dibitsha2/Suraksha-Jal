'use client';

import { useState } from 'react';
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
  ScanLine,
  User,
  Lock,
} from 'lucide-react';

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

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const userRegisterSchema = z.object({
  username: z.string().min(2, 'Username is too short'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const healthWorkerRegisterSchema = userRegisterSchema.extend({
  govId: z.any().refine(file => file?.name, 'Government ID is required.'),
});

type LoginValues = z.infer<typeof loginSchema>;
type UserRegisterValues = z.infer<typeof userRegisterSchema>;
type HealthWorkerRegisterValues = z.infer<typeof healthWorkerRegisterSchema>;

type IdVerificationState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

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
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginValues> = async (data) => {
    // Mock login
    console.log('Login data:', data);
    toast({
      title: 'Login Successful',
      description: 'Redirecting to dashboard...',
    });
    router.push('/dashboard');
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
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
  const [registerTab, setRegisterTab] = useState('user');

  return (
    <Tabs value={registerTab} onValueChange={setRegisterTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="user">User</TabsTrigger>
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
        console.log('User registration data:', data);
        toast({
            title: 'Registration Successful',
            description: "You can now log in.",
        });
        // In a real app, you would redirect to a login page or auto-login.
        // For now, we simulate success and they can switch to login tab.
        router.push('/auth');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a User Account</CardTitle>
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
    const [verificationState, setVerificationState] = useState<IdVerificationState>({ status: 'idle', message: '' });

    const form = useForm<HealthWorkerRegisterValues>({
        resolver: zodResolver(healthWorkerRegisterSchema),
        defaultValues: { username: '', email: '', address: '', password: '' },
    });

    const handleIdVerification = async (file: File) => {
        if (!file) return;

        setVerificationState({ status: 'loading', message: 'Verifying ID...' });

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const idDataUri = reader.result as string;
            try {
                const result = await verifyHealthWorkerId({ idDataUri });
                if (result.isValid) {
                    setVerificationState({ status: 'success', message: 'ID Verified successfully!' });
                } else {
                    setVerificationState({ status: 'error', message: `Verification failed: ${result.reason}` });
                }
            } catch (error) {
                console.error(error);
                setVerificationState({ status: 'error', message: 'An error occurred during verification.' });
            }
        };
        reader.onerror = () => {
             setVerificationState({ status: 'error', message: 'Failed to read the file.' });
        }
    };

    const onSubmit: SubmitHandler<HealthWorkerRegisterValues> = async (data) => {
        if (verificationState.status !== 'success') {
            toast({
                variant: 'destructive',
                title: 'ID Not Verified',
                description: 'Please upload and verify your Government ID before registering.',
            });
            return;
        }
        console.log('Health worker registration data:', data);
        toast({
            title: 'Registration Submitted',
            description: "Your application is under review. You'll be notified upon approval.",
        });
        router.push('/auth');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Worker Registration</CardTitle>
                <CardDescription>Join the network to submit local area reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Fields are same as user but we can copy them for clarity */}
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

                        <FormField
                            control={form.control}
                            name="govId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid Government ID</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="pl-10 file:text-sm file:font-medium file:text-muted-foreground file:mr-4"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(file);
                                                    if(file) handleIdVerification(file);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {verificationState.status !== 'idle' && (
                            <div className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                                verificationState.status === 'loading' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                                verificationState.status === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                                'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            }`}>
                                {verificationState.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {verificationState.status === 'success' && <FileCheck2 className="h-4 w-4" />}
                                {verificationState.status === 'error' && <FileX2 className="h-4 w-4" />}
                                <span className="flex-1">{verificationState.message}</span>
                            </div>
                        )}
                        
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting || verificationState.status === 'loading' || verificationState.status !== 'success'}
                        >
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
