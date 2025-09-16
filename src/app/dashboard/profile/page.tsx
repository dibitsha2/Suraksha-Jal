
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Loader2, LocateFixed, Upload } from 'lucide-react';
import { debounce } from 'lodash';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

const profileSchema = z.object({
  photoURL: z.string().optional(),
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
  address: z.string().min(5, 'Address is too short').optional(),
  age: z.coerce.number().min(1, 'Age must be 1 or greater').optional(),
  weight: z.coerce.number().min(1, 'Weight must be a positive number').optional(),
  height: z.coerce.number().min(1, 'Height must be a positive number').optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
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


export default function ProfilePage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      photoURL: '',
      name: '',
      email: '',
      address: '',
      age: undefined,
      weight: undefined,
      height: undefined,
      bloodGroup: undefined,
    },
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const extraData = loadExtraProfileData(currentUser.uid);
        form.reset({
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            ...extraData,
        });
    }
  }, [form]);
  
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      if (data.length > 0) {
        setIsSuggestionsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('address', value);
    debouncedFetchSuggestions(value);
  };
  
  const handleSuggestionClick = (suggestion: any) => {
    form.setValue('address', suggestion.display_name, { shouldValidate: true });
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data && data.display_name) {
              form.setValue('address', data.display_name, { shouldValidate: true });
              toast({
                title: 'Location Fetched',
                description: 'Your address has been set.',
              });
            } else {
                throw new Error('Could not parse address from API response.');
            }
          } catch(apiError) {
             console.error('Reverse geocoding error:', apiError);
             toast({
                variant: 'destructive',
                title: 'Address Error',
                description: 'Could not fetch your address. Please enter it manually.',
            });
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description:
              error.code === error.PERMISSION_DENIED
                ? 'You denied the request for Geolocation.'
                : 'Could not get your location. Please try again.',
          });
          setIsFetchingLocation(false);
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support Geolocation.',
      });
    }
  };

  const onSubmit = async (data: ProfileValues) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to update your profile.' });
        return;
    }

    try {
        await updateProfile(currentUser, {
            displayName: data.name,
            photoURL: data.photoURL,
        });

        // Save non-standard Firebase fields to our mock DB (localStorage)
        const { name, photoURL, email, ...extraData } = data;
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
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('profile')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Personal Information</CardTitle>
          <CardDescription>Update your personal and health details here.</CardDescription>
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
                          <User className="h-12 w-12" />
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
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <div className="flex items-center gap-2">
                        <div className="relative w-full">
                          <FormControl>
                            <Input
                              placeholder="Start typing your address..."
                              {...field}
                              value={field.value ?? ''}
                              onChange={handleAddressChange}
                              onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 150)}
                              autoComplete="off"
                            />
                          </FormControl>
                          {isSuggestionsVisible && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                              <ul className="py-1">
                                {suggestions.map((suggestion) => (
                                  <li
                                    key={suggestion.place_id}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion.display_name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleGetLocation}
                          disabled={isFetchingLocation}
                          aria-label="Use live location"
                        >
                          {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Your age" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Your weight in kilograms" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (ft)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Your height in feet" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

    