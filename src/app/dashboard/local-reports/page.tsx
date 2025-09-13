
'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Search, Calendar, BarChart2 } from 'lucide-react';
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

// This is mock data. In a real app, this would come from a database
// filled with reports from verified health workers.
const generateMockReports = () => {
    const today = new Date();
    return [
        { id: 1, disease: 'Cholera', location: 'Mumbai, Maharashtra', cases: 15, date: format(today, 'yyyy-MM-dd') },
        { id: 2, disease: 'Typhoid', location: 'Delhi, NCT', cases: 8, date: format(subDays(today, 1), 'yyyy-MM-dd') },
        { id: 3, disease: 'Hepatitis A', location: 'Kolkata, West Bengal', cases: 5, date: format(subDays(today, 2), 'yyyy-MM-dd') },
        { id: 4, disease: 'Cholera', location: 'Chennai, Tamil Nadu', cases: 12, date: format(subDays(today, 3), 'yyyy-MM-dd') },
        { id: 5, disease: 'Typhoid', location: 'Mumbai, Maharashtra', cases: 6, date: format(subDays(today, 4), 'yyyy-MM-dd') },
        { id: 6, disease: 'Giardiasis', location: 'Pune, Maharashtra', cases: 7, date: format(subDays(today, 1), 'yyyy-MM-dd') },
        { id: 7, disease: 'Dysentery', location: 'Jaipur, Rajasthan', cases: 9, date: format(today, 'yyyy-MM-dd') },
    ];
}

const mockReports = generateMockReports();


export default function LocalReportsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState(mockReports);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.address) {
            // Attempt to extract a city/state from the address to pre-filter
            const locationParts = profile.address.split(',');
            const primaryLocation = locationParts[0]?.trim().toLowerCase();
            if (primaryLocation) {
                 const userLocationReports = mockReports.filter(report => 
                    report.location.toLowerCase().includes(primaryLocation)
                );
                if(userLocationReports.length > 0) {
                    setFilteredReports(userLocationReports);
                }
            }
        }
      }
    } catch (error) {
        console.error('Failed to load user profile for local reports:', error);
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery) {
        setFilteredReports(mockReports);
        return;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = mockReports.filter(report => 
      report.disease.toLowerCase().includes(lowercasedQuery) ||
      report.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredReports(filtered);
  };

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
                View recent waterborne disease reports submitted by verified health workers.
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead>
                     <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date Reported
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.disease}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{report.cases}</TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No reports found for your query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <p className="text-xs text-muted-foreground mt-4">
                Disclaimer: This data is for informational purposes only and is based on mock data. In a real-world scenario, this would be populated by reports from verified health officials.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
