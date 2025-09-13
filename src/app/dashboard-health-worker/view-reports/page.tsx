'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Search, Calendar, BarChart2, Info, FilePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { subDays, format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';


// This is mock data. In a real app, this would come from a database
// filled with reports from verified health workers.
const generateMockReports = () => {
    const today = new Date();
    return [
        { id: 1, disease: 'Cholera', location: 'Mumbai, Maharashtra', cases: 15, date: format(today, 'yyyy-MM-dd'), source: 'Community' },
        { id: 2, disease: 'Typhoid', location: 'Delhi, NCT', cases: 8, date: format(subDays(today, 1), 'yyyy-MM-dd'), source: 'Health Worker' },
        { id: 3, disease: 'Hepatitis A', location: 'Kolkata, West Bengal', cases: 5, date: format(subDays(today, 2), 'yyyy-MM-dd'), source: 'Community' },
        { id: 4, disease: 'Cholera', location: 'Chennai, Tamil Nadu', cases: 12, date: format(subDays(today, 3), 'yyyy-MM-dd'), source: 'Community' },
        { id: 5, disease: 'Typhoid', location: 'Mumbai, Maharashtra', cases: 6, date: format(subDays(today, 4), 'yyyy-MM-dd'), source: 'Health Worker' },
        { id: 6, disease: 'Giardiasis', location: 'Pune, Maharashtra', cases: 7, date: format(subDays(today, 1), 'yyyy-MM-dd'), source: 'Community' },
        { id: 7, disease: 'Dysentery', location: 'Jaipur, Rajasthan', cases: 9, date: format(today, 'yyyy-MM-dd'), source: 'Health Worker' },
    ];
}

const initialMockReports = generateMockReports();


export default function ViewReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allReports, setAllReports] = useState(initialMockReports);
  const [filteredReports, setFilteredReports] = useState(initialMockReports);

  useEffect(() => {
    // Combine initial reports with any from local storage
    const storedReports = JSON.parse(localStorage.getItem('mockReports') || '[]');
    const combined = [...storedReports, ...initialMockReports];
    // Simple deduplication
    const uniqueReports = Array.from(new Set(combined.map(a => a.id)))
        .map(id => {
            return combined.find(a => a.id === id)
        })
    
    setAllReports(uniqueReports as any);
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
    }
    setFilteredReports(reportsToFilter);
  }, [searchQuery, allReports]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">View Health Reports</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span>Submitted Health Reports</span>
              </CardTitle>
              <CardDescription>
                View all recent waterborne disease reports.
              </CardDescription>
            </div>
             <Button asChild>
                <Link href="/dashboard-health-worker/submit-report">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Submit New Report
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex w-full mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by disease or location..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
         
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
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.disease}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{report.cases}</TableCell>
                      <TableCell>
                        <Badge variant={report.source === 'Health Worker' ? 'default' : 'secondary'}>
                          {report.source}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No reports found.
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
