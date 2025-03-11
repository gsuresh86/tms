"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Ticket } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TicketIcon, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Activity,
  PlusCircle,
  ArrowUpRight
} from 'lucide-react';

// Define colors for status and priority
const STATUS_COLORS = {
  open: '#3b82f6', // blue
  in_progress: '#f59e0b', // amber
  resolved: '#10b981', // green
  closed: '#6b7280', // gray
};

const PRIORITY_COLORS = {
  low: '#10b981', // green
  medium: '#f59e0b', // amber
  high: '#f97316', // orange
  critical: '#ef4444', // red
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    recentlyCreated: 0,
    recentlyResolved: 0
  });
  const [statusData, setStatusData] = useState<any[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);

  useEffect(() => {
    fetchTicketStats();
  }, []);

  const fetchTicketStats = async () => {
    setIsLoading(true);
    try {
      // Get all tickets
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*');

      if (error) throw error;

      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        critical: tickets.filter(t => t.priority === 'critical').length,
        high: tickets.filter(t => t.priority === 'high').length,
        medium: tickets.filter(t => t.priority === 'medium').length,
        low: tickets.filter(t => t.priority === 'low').length,
        recentlyCreated: tickets.filter(t => new Date(t.created_at) > oneWeekAgo).length,
        recentlyResolved: tickets.filter(t => 
          t.status === 'resolved' && 
          new Date(t.updated_at) > oneWeekAgo
        ).length
      };

      setTicketStats(stats);

      // Prepare chart data
      const statusChartData = [
        { name: 'Open', value: stats.open, color: STATUS_COLORS.open },
        { name: 'In Progress', value: stats.in_progress, color: STATUS_COLORS.in_progress },
        { name: 'Resolved', value: stats.resolved, color: STATUS_COLORS.resolved },
        { name: 'Closed', value: stats.closed, color: STATUS_COLORS.closed },
      ];

      const priorityChartData = [
        { name: 'Critical', value: stats.critical, color: PRIORITY_COLORS.critical },
        { name: 'High', value: stats.high, color: PRIORITY_COLORS.high },
        { name: 'Medium', value: stats.medium, color: PRIORITY_COLORS.medium },
        { name: 'Low', value: stats.low, color: PRIORITY_COLORS.low },
      ];

      setStatusData(statusChartData);
      setPriorityData(priorityChartData);
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-4">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/tickets">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TicketIcon className="h-5 w-5 text-primary mr-2" />
                <div className="text-2xl font-bold">{ticketStats.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{ticketStats.open}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                <div className="text-2xl font-bold">{ticketStats.in_progress}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div className="text-2xl font-bold">{ticketStats.resolved}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Tickets by Status</CardTitle>
              <CardDescription>Distribution of tickets across different statuses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Tickets by Priority</CardTitle>
              <CardDescription>Distribution of tickets across different priority levels</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Ticket activity in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <PlusCircle className="h-4 w-4 text-blue-500 mr-2" />
                    <span>New Tickets Created</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{ticketStats.recentlyCreated}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Tickets Resolved</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{ticketStats.recentlyResolved}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/tickets" className="w-full">
                <Button variant="outline" className="w-full">
                  <span>View All Tickets</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Critical Issues
              </CardTitle>
              <CardDescription>High priority tickets that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span>Critical Priority</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{ticketStats.critical}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{ticketStats.high}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/tickets" className="w-full">
                <Button variant="outline" className="w-full">
                  <span>View Priority Issues</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 