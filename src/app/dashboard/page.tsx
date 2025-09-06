import Link from 'next/link';
import { Stethoscope, Droplet, Users, Activity } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data for local reports
const localReports = [
  { disease: 'Cholera', cases: 12, trend: 'up' },
  { disease: 'Typhoid', cases: 8, trend: 'down' },
  { disease: 'Hepatitis A', cases: 5, trend: 'stable' },
  { disease: 'Giardiasis', cases: 21, trend: 'up' },
];

export default function DashboardPage() {
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
        <div className="flex flex-col items-center gap-2 text-center bg-background/80 p-8 rounded-lg">
          <Stethoscope className="h-16 w-16 text-primary" />
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Feeling unwell?
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Use our AI-powered symptom checker to identify potential waterborne diseases and learn about preventive measures.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/symptom-checker">Check Symptoms</Link>
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 font-headline">Local Area Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {localReports.map((report, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{report.disease}</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.cases}</div>
                <p className="text-xs text-muted-foreground">cases reported in your area</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
