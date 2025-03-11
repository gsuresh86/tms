"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CreateTicketForm } from '@/components/CreateTicketForm';
import { supabase } from '@/lib/supabase';
import { Ticket } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from '@/lib/utils';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data as Ticket[]);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tickets. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreateDrawerOpen(false);
    fetchTickets();
    toast({
      title: 'Success',
      description: 'Ticket created successfully!',
    });
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      open: 'bg-blue-500 text-white',
      in_progress: 'bg-yellow-500 text-white',
      resolved: 'bg-green-500 text-white',
      closed: 'bg-gray-500 text-white',
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      low: 'bg-green-200 text-green-800',
      medium: 'bg-yellow-200 text-yellow-800',
      high: 'bg-orange-200 text-orange-800',
      critical: 'bg-red-200 text-red-800',
    };
    
    return (
      <Badge variant="outline" className={priorityStyles[priority as keyof typeof priorityStyles]}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tickets</h1>
          <Sheet open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
            <SheetTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md md:max-w-lg">
              <SheetHeader>
                <SheetTitle>Create New Ticket</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <CreateTicketForm onSuccess={handleCreateSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 border rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">Create your first ticket to get started.</p>
            <Button onClick={() => setIsCreateDrawerOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewTicket(ticket)}>
                    <TableCell className="font-medium">#{ticket.id}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{ticket.title}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(ticket.created_at))} ago</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleViewTicket(ticket);
                      }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedTicket && (
          <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{selectedTicket.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 capitalize">{selectedTicket.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className="mt-1 capitalize">{selectedTicket.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm">{selectedTicket.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1 text-sm">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-sm">
                    {new Date(selectedTicket.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </main>
    </div>
  );
} 