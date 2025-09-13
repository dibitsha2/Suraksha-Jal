
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardPlus, Pill, BarChart2 } from "lucide-react";
import Link from 'next/link';

export default function HealthWorkerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Health Worker Dashboard</h1>
      </div>
      
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center min-h-[300px]"
        style={{ backgroundImage: "url('https://picsum.photos/seed/hw-dash/1200/400?blur=10')" }}
        data-ai-hint="medical supplies"
      >
        <div className="flex flex-col items-center gap-4 text-center bg-background/80 p-8 rounded-lg">
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Welcome, Health Worker!
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Manage reports, track medication stock, and view local health statistics.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors">
          <Link href="/dashboard-health-worker/submit-report">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submit New Report</CardTitle>
              <ClipboardPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Log new cases of waterborne diseases in your area.</p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
           <Link href="/dashboard-health-worker/medication-stock">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medication Stock</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View and manage local medication inventory.</p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
          <Link href="/dashboard/local-reports">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">View Reports</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">See an overview of all submitted health reports.</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}

    