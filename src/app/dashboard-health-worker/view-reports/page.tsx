
'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Search, Calendar, BarChart2, FilePlus, Loader2 } from 'lucide-react';
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
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';

interface Report {
    id: number;
    disease: string;
    location: string;
    cases: number;
    date: string;
    severity: 'low' | 'medium' | 'high';
    notes?: string;
    source: string;
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

export default function ViewReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    } catch (e) {
      console.error(e);
      setAllReports(generateMockReports()); // fallback to initial mocks on error
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
                View all health reports submitted by health workers.
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
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <p className="text-xs text-muted-foreground mt-4">
                Disclaimer: This data is for informational purposes and is based on health worker submissions and system-generated data.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
