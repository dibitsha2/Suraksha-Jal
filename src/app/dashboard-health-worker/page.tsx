
'use client';

import { BarChart, FilePlus, Users } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HealthWorkerDashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Health Worker Dashboard</h1>
            </div>

            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-cover bg-center min-h-[300px]"
                style={{ backgroundImage: "url('https://picsum.photos/seed/hw/1200/400?blur=10')" }}
                data-ai-hint="medical equipment"
            >
                <div className="flex flex-col items-center gap-4 text-center bg-background/80 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold tracking-tight font-headline">
                        Welcome, Health Worker!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Your role is crucial in monitoring and reporting public health information. Use the tools below to get started.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button asChild>
                            <Link href="/dashboard-health-worker/submit-report">
                                <FilePlus className="mr-2 h-4 w-4" />
                                Submit a New Report
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard-health-worker/view-reports">
                                <BarChart className="mr-2 h-4 w-4" />
                                View Existing Reports
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Your Submitted Reports
                        </CardTitle>
                        <FilePlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 in the last 7 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Reports (Community)
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Reported Disease</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Cholera</div>
                        <p className="text-xs text-muted-foreground">
                            In your assigned region
                        </p>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
