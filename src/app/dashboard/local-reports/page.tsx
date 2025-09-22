
'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Search, Calendar, BarChart2, Info, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { subDays, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Report {
    id: number;
    disease: string;
    location: string;
    cases: number;
    date: string;
    source: string;
    severity?: 'low' | 'medium' | 'high';
}

const generateMockReports = (): Report[] => {
    const today = new Date();
    return [
        { id: 1, disease: 'Cholera', location: 'Mumbai, Maharashtra', cases: 1500, date: format(today, 'yyyy-MM-dd'), severity: 'high', source: 'System' },
        { id: 2, disease: 'Typhoid', location: 'Delhi, NCT', cases: 850, date: format(subDays(today, 1), 'yyyy-MM-dd'), severity: 'medium', source: 'System' },
        { id: 3, disease: 'Hepatitis A', location: 'Kolkata, West Bengal', cases: 520, date: format(subDays(today, 2), 'yyyy-MM-dd'), severity: 'low', source: 'System' },
        { id: 4, disease: 'Cholera', location: 'Chennai, Tamil Nadu', cases: 1230, date: format(subDays(today, 3), 'yyyy-MM-dd'), severity: 'medium', source: 'System' },
        { id: 5, disease: 'Typhoid', location: 'Mumbai, Maharashtra', cases: 680, date: format(subDays(today, 4), 'yyyy-MM-dd'), severity: 'low', source: 'System' },
    ];
}


export default function LocalReportsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const profile = userProfiles[user.uid];

        if (profile && profile.address) {
            setUserLocation(profile.address);
        }
    } catch (error) {
        console.error('Failed to load user profile for local reports:', error);
    }
    
    setLoading(true);
    try {
        const initialMockReports = generateMockReports();
        const storedReports: Report[] = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const combined = [...storedReports, ...initialMockReports];
        const uniqueReports = Array.from(new Set(combined.map(a => a.id)))
            .map(id => combined.find(a => a.id === id)!)
            .sort((a, b) => {
                if (a.source === 'Health Worker' && b.source !== 'Health Worker') return -1;
                if (a.source !== 'Health Worker' && b.source === 'Health Worker') return 1;
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });
        setAllReports(uniqueReports);
    } catch(e) {
        console.error("Failed to load reports:", e);
        setAllReports(generateMockReports());
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Filter logic
    let reportsToFilter = [...allReports];
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        reportsToFilter = allReports.filter(report => 
            report.disease.toLowerCase().includes(lowercasedQuery) ||
            report.location.toLowerCase().includes(lowercasedQuery)
        );
    } else if (userLocation) {
        const primaryLocation = userLocation.split(',')[0]?.trim().toLowerCase();
        if (primaryLocation) {
            const userLocationReports = allReports.filter(report => 
                report.location.toLowerCase().includes(primaryLocation)
            );
            if(userLocationReports.length > 0) {
                const otherReports = allReports.filter(report => !report.location.toLowerCase().includes(primaryLocation));
                reportsToFilter = [...userLocationReports, ...otherReports];
            }
        }
    }
    setFilteredReports(reportsToFilter);
  }, [searchQuery, allReports, userLocation]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('reports')}</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span>Local Area Health Reports</span>
              </CardTitle>
              <CardDescription>
                View recent waterborne disease reports submitted by health workers and the community.
              </CardDescription>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by disease or location..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setSearchQuery('')}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userLocation && !searchQuery && (
              <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-center gap-3">
                  <Info className="h-5 w-5" />
                  <p>Showing reports initially filtered for your location: <strong>{userLocation.split(',')[0]}</strong>. Clear the search or use the filter to see all reports.</p>
              </div>
          )}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" /> Disease
                    </div>
                  </TableHead>
                  <TableHead>
                     <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Reported Cases</TableHead>
                   <TableHead>Source</TableHead>
                  <TableHead>
                     <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date Reported
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                           <div className="flex justify-center items-center gap-2">
                             <Loader2 className="h-6 w-6 animate-spin text-primary" />
                             <p className="text-muted-foreground">Loading reports...</p>
                           </div>
                        </TableCell>
                    </TableRow>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.disease}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{report.cases.toLocaleString()}</TableCell>
                       <TableCell>
                        <Badge variant={report.source === 'System' ? 'secondary' : 'default'}>
                          {report.source || 'Health Worker'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No reports found for your current filter or location.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <p className="text-xs text-muted-foreground mt-4">
                Disclaimer: This data is for informational purposes and combines mock data with community submissions. It may not be fully verified.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
