
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertTriangle, Phone, Hospital, MapPin, Building, Siren, Info } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getEmergencyContacts,
  type EmergencyContactOutput,
} from '@/ai/flows/emergency-contact-suggester';
import { useLanguage } from '@/hooks/use-language';

export default function EmergencyContactsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmergencyContactOutput | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfileAndContacts = async () => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                if (profile.address) {
                    setLocation(profile.address);
                    const response = await getEmergencyContacts({ location: profile.address });
                    setResult(response);
                } else {
                    setError("No location found in your profile. Please update your address to get local emergency contacts.");
                }
            } else {
                 setError("Could not find your profile. Please complete your profile to use this feature.");
            }
        } catch (e) {
            console.error(e);
            setError('An error occurred while fetching emergency contacts. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    fetchProfileAndContacts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Emergency Contacts</h1>
      </div>
      
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Fetching local emergency information...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card className="border-destructive">
          <CardHeader className="flex-row gap-4 items-center">
            <AlertTriangle className="text-destructive h-8 w-8" />
            <div>
              <CardTitle className="text-destructive">Could Not Fetch Information</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
                { (error.includes('profile')) &&
                    <Button variant="destructive" asChild className="mt-4">
                        <Link href="/dashboard/profile">Update Profile</Link>
                    </Button>
                }
            </div>
          </CardHeader>
        </Card>
      )}

      {result && !loading && (
        <div className="space-y-6">
            <Card className="border-primary bg-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Siren className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="font-headline text-2xl">National Emergency Number</CardTitle>
                            <CardDescription>For immediate assistance, dial this number.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary tracking-widest text-center bg-background p-4 rounded-lg">
                        {result.nationalEmergencyNumber}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /> Suggested Hospitals</CardTitle>
                    <CardDescription>Nearby hospitals based on your location: <strong>{location}</strong></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {result.suggestedHospitals.length > 0 ? (
                        result.suggestedHospitals.map((hospital, index) => (
                            <Card key={index} className="p-4">
                                <h3 className="font-semibold">{hospital.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /> {hospital.address}</p>
                                {hospital.phone && <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Phone className="h-4 w-4" /> {hospital.phone}</p>}
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full text-center">No suggested hospitals found for your location.</p>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Suggested Clinics</CardTitle>
                     <CardDescription>Nearby clinics based on your location: <strong>{location}</strong></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {result.suggestedClinics.length > 0 ? (
                        result.suggestedClinics.map((clinic, index) => (
                            <Card key={index} className="p-4">
                                <h3 className="font-semibold">{clinic.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /> {clinic.address}</p>
                                {clinic.phone && <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Phone className="h-4 w-4" /> {clinic.phone}</p>}
                            </Card>
                        ))
                    ) : (
                         <p className="text-muted-foreground col-span-full text-center">No suggested clinics found for your location.</p>
                    )}
                </CardContent>
            </Card>


            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 flex items-start gap-4">
                <Info className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold">Disclaimer</h4>
                    <p className="text-sm font-medium">{result.disclaimer}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
