import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type TicketComment = {
  id: number;
  ticket_id: number;
  content: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
};

export type TicketHistory = {
  id: number;
  ticket_id: number;
  field_name: string;
  old_value?: string;
  new_value?: string;
  changed_by?: string;
  created_at: string;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
  created_at: string;
};

export type TicketWithRelations = Ticket & {
  comments?: TicketComment[];
  history?: TicketHistory[];
  tags?: Tag[];
};

// Helper functions for working with tickets
export const ticketService = {
  // Get all tickets
  async getTickets() {
    return supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
  },

  // Get a single ticket with all its relations
  async getTicketById(id: number) {
    return supabase
      .from('tickets')
      .select(`
        *,
        comments:ticket_comments(*),
        tags:ticket_tags(tag_id, tags(*))
      `)
      .eq('id', id)
      .single();
  },

  // Create a new ticket
  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
    return supabase.from('tickets').insert(ticket);
  },

  // Update a ticket
  async updateTicket(id: number, updates: Partial<Ticket>) {
    return supabase.from('tickets').update(updates).eq('id', id);
  },

  // Delete a ticket
  async deleteTicket(id: number) {
    return supabase.from('tickets').delete().eq('id', id);
  },

  // Add a comment to a ticket
  async addComment(ticketId: number, content: string, userId?: string) {
    return supabase.from('ticket_comments').insert({
      ticket_id: ticketId,
      content,
      user_id: userId,
    });
  },

  // Get ticket history
  async getTicketHistory(ticketId: number) {
    return supabase
      .from('ticket_history')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
  },

  // Get all tags
  async getTags() {
    return supabase.from('tags').select('*');
  },

  // Add tags to a ticket
  async addTagsToTicket(ticketId: number, tagIds: number[]) {
    const tagEntries = tagIds.map(tagId => ({
      ticket_id: ticketId,
      tag_id: tagId
    }));
    return supabase.from('ticket_tags').insert(tagEntries);
  },

  // Remove a tag from a ticket
  async removeTagFromTicket(ticketId: number, tagId: number) {
    return supabase
      .from('ticket_tags')
      .delete()
      .eq('ticket_id', ticketId)
      .eq('tag_id', tagId);
  }
}; 