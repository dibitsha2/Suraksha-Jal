'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, Droplet, Shield, MapPin, LocateFixed, Loader2, AlertTriangle, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getLocalReports, type GetLocalReportsOutput } from '@/ai/flows/get-local-reports';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Report = {
  disease: string;
  cases: number;
  trend: 'up' | 'down' | 'stable';
};

export default function DashboardPage() {
  const [location, setLocation] = useState('Mumbai, India');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (loc: string) => {
    if (!loc) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getLocalReports({ location: loc });
      setReports(response.reports || []);
    } catch (e) {
      console.error(e);
      setError('Could not fetch local reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(location);
  }, []);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(location);
  };
  
  const handleLiveLocation = () => {
    // This is a mock for using live location.
    // In a real app, you would use navigator.geolocation
    const mockLocation = "Kolkata, India";
    setLocation(mockLocation);
    fetchReports(mockLocation);
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/1200/400?blur=10')" }}
        data-ai-hint="water droplets"
      >
        <div className="flex flex-col items-center gap-4 text-center bg-background/80 p-8 rounded-lg">
          <div className="flex items-center gap-8">
            <Stethoscope className="h-16 w-16 text-primary" />
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Your Health is Our Priority
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Use our AI symptom checker or learn about how to prevent waterborne diseases.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/dashboard/symptom-checker">Check Symptoms</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/precautions">View Precautions</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 font-headline">Local Area Reports</h2>
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Check Disease Cases in Your Area</CardTitle>
                <CardDescription>Enter your location to get a report of recent waterborne disease cases.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLocationSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="e.g., Delhi, India" 
                            className="pl-10"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading || !location}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Get Report
                        </Button>
                         <Button type="button" variant="outline" onClick={handleLiveLocation} disabled={loading}>
                            <LocateFixed className="mr-2 h-4 w-4" />
                            Use Live Location
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>For Illustrative Purposes Only</AlertTitle>
          <AlertDescription>
            The reports generated below are based on AI-generated mock data and do not reflect real-time government health statistics. Always refer to official public health sources for accurate information.
          </AlertDescription>
        </Alert>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-1/4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {error && !loading && (
             <Card className="border-destructive">
                <CardHeader className="flex-row gap-4 items-center">
                    <AlertTriangle className="text-destructive" />
                    <div>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription className="text-destructive/80">{error}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{report.disease}</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.cases}</div>
                  <p className="text-xs text-muted-foreground">cases reported in your area (trend: {report.trend})</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

         {!loading && !error && reports.length === 0 && (
             <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    <p>No reports found for the selected location.</p>
                </CardContent>
             </Card>
         )}
      </div>
    </>
  );
}
