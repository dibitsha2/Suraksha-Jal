
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Globe, MapPin, Search, Calendar, BarChart2 as BarChart2Icon, FilePlus, Loader2, Trash2, AlertTriangle } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function ViewReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const { toast } = useToast();

  const chartData = useMemo(() => {
    const locationData = filteredReports.reduce((acc, report) => {
        const location = report.location.split(',')[0].trim();
        if (!acc[location]) {
            acc[location] = 0;
        }
        acc[location] += report.cases;
        return acc;
    }, {} as Record<string, number>);

    const diseaseData = filteredReports.reduce((acc, report) => {
        const disease = report.disease;
        if (!acc[disease]) {
            acc[disease] = 0;
        }
        acc[disease] += report.cases;
        return acc;
    }, {} as Record<string, number>);
    
    const barChartData = Object.entries(locationData).map(([location, cases]) => ({ location, cases }));
    const pieChartData = Object.entries(diseaseData).map(([name, value]) => ({ name, value }));

    const pieChartConfig = pieChartData.reduce((acc, data, index) => {
        acc[data.name] = {
            label: data.name,
            color: COLORS[index % COLORS.length]
        };
        return acc;
    }, {} as ChartConfig);

    return { barChartData, pieChartData, pieChartConfig };
  }, [filteredReports]);

  const loadReports = () => {
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
  };
  
  useEffect(() => {
    loadReports();
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
  
  const handleDeleteReport = () => {
    if (!reportToDelete) return;

    try {
        const storedReports: Report[] = JSON.parse(localStorage.getItem('mockReports') || '[]');
        const updatedStoredReports = storedReports.filter(report => report.id !== reportToDelete.id);
        localStorage.setItem('mockReports', JSON.stringify(updatedStoredReports));

        setAllReports(prev => prev.filter(report => report.id !== reportToDelete.id));
        
        toast({
            title: 'Report Deleted',
            description: `The report for "${reportToDelete.disease}" has been removed.`,
        });

    } catch (e) {
        console.error("Failed to delete report:", e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to delete the report. Please try again.',
        });
    } finally {
        setReportToDelete(null);
    }
  };


  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">View Health Reports</h1>
        </div>

        {filteredReports.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Report Statistics</CardTitle>
                    <CardDescription>Visual summary of the reports shown below.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-center">Cases by Location</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="location" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))' }}/>
                                <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2 text-center">Cases by Disease</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <ChartContainer config={chartData.pieChartConfig}>
                               <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                                    <Pie 
                                        data={chartData.pieChartData} 
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={110}
                                        labelLine={false}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                            return (
                                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {chartData.pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                     <Legend />
                                </PieChart>
                            </ChartContainer>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        )}

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
                        <BarChart2Icon className="h-4 w-4" /> Disease
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                      <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
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
                        <TableCell className="text-right">
                          {report.source === 'Health Worker' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setReportToDelete(report)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete Report</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
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

       <AlertDialog open={reportToDelete !== null} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pl-16">
              This action cannot be undone. This will permanently delete the report
              for "{reportToDelete?.disease}" in "{reportToDelete?.location}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pl-16">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReport}
              className="bg-destructive hover:bg-destructive/90"
            >
                Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

    

    