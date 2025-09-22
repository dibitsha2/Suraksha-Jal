
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, User as UserIcon, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

const profileSchema = z.object({
  photoURL: z.string().optional(),
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
  workerId: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

// This is a mock function. In a real app, you would save this to a database like Firestore.
const saveExtraProfileData = (userId: string, data: any) => {
    try {
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        userProfiles[userId] = { ...userProfiles[userId], ...data };
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    } catch (e) {
        console.error("Failed to save extra profile data", e);
    }
}

const loadExtraProfileData = (userId: string) => {
    try {
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        return userProfiles[userId] || {};
    } catch(e) {
        console.error("Failed to load extra profile data", e);
        return {};
    }
}


export default function HealthWorkerProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      photoURL: '',
      name: '',
      email: '',
      workerId: '',
    },
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const extraData = loadExtraProfileData(currentUser.uid);
        form.reset({
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: extraData.photoURL || currentUser.photoURL || '',
            ...extraData,
        });
    }
  }, [form]);
  

  const onSubmit = async (data: ProfileValues) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to update your profile.' });
        return;
    }

    try {
        await updateProfile(currentUser, {
            displayName: data.name,
        });

        // Save non-standard Firebase fields to our mock DB (localStorage)
        const { name, email, ...extraData } = data;
        saveExtraProfileData(currentUser.uid, extraData);


        toast({
            title: 'Profile Updated',
            description: 'Your information has been saved successfully.',
        });
        // Force a re-render or state update in the layout if needed
        window.dispatchEvent(new Event('profileUpdated'));


    } catch (error) {
       console.error('Failed to save profile:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not save your profile. Please try again.',
        });
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
            variant: 'destructive',
            title: 'Image Too Large',
            description: 'Please select an image smaller than 2MB.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('photoURL', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Worker Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="photoURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={field.value ?? undefined} alt="Profile Picture" />
                        <AvatarFallback>
                          <UserIcon className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Picture
                      </Button>
                      <FormControl>
                        <Input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handlePictureUpload}
                          accept="image/png, image/jpeg, image/gif"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} value={field.value ?? ''} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Worker ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Your official ID" {...field} value={field.value ?? ''} disabled/>
                        </div>
                      </FormControl>
                       <FormDescription>Your worker ID cannot be changed.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
