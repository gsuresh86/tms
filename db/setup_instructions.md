# Setting Up the Database in Supabase

This document provides step-by-step instructions for setting up the ticket management system database in Supabase.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com) if you don't have one)
- A new or existing Supabase project

## Setup Instructions

### Option 1: Using the Supabase SQL Editor

1. Log in to your Supabase dashboard
2. Select your project
3. Navigate to the SQL Editor in the left sidebar
4. Create a new query
5. Copy and paste the contents of the `schema.sql` file into the SQL editor
6. Run the query to create all tables, constraints, and functions

### Option 2: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Apply the migration:
   ```bash
   supabase db push
   ```

## Database Schema Overview

The database schema includes the following tables:

### 1. tickets
The main table for storing ticket information:
- `id`: Unique identifier for the ticket
- `title`: Ticket title
- `description`: Detailed description of the ticket
- `status`: Current status (open, in_progress, resolved, closed)
- `priority`: Importance level (low, medium, high, critical)
- `assignee_id`: User assigned to the ticket (optional)
- `created_by`: User who created the ticket
- `created_at`: Timestamp when the ticket was created
- `updated_at`: Timestamp when the ticket was last updated

### 2. ticket_comments
Stores comments and discussions related to tickets:
- `id`: Unique identifier for the comment
- `ticket_id`: Reference to the ticket
- `content`: Comment text
- `user_id`: User who made the comment
- `created_at`: Timestamp when the comment was created
- `updated_at`: Timestamp when the comment was last updated

### 3. ticket_history
Tracks changes made to tickets for audit purposes:
- `id`: Unique identifier for the history record
- `ticket_id`: Reference to the ticket
- `field_name`: Name of the field that was changed
- `old_value`: Previous value
- `new_value`: New value
- `changed_by`: User who made the change
- `created_at`: Timestamp when the change occurred

### 4. tags
Stores available tags for categorizing tickets:
- `id`: Unique identifier for the tag
- `name`: Tag name
- `color`: Color code for the tag
- `created_at`: Timestamp when the tag was created

### 5. ticket_tags
Junction table for the many-to-many relationship between tickets and tags:
- `ticket_id`: Reference to the ticket
- `tag_id`: Reference to the tag
- `created_at`: Timestamp when the association was created

## Automatic Features

The schema includes several automatic features:

1. **Updated Timestamps**: The `updated_at` column is automatically updated whenever a record is modified.

2. **History Tracking**: Changes to ticket fields are automatically recorded in the `ticket_history` table.

3. **Constraints**: Status and priority fields are restricted to predefined values.

4. **Indexes**: Appropriate indexes are created for better query performance.

## Row Level Security (RLS)

The schema includes commented RLS policies that you can uncomment and customize once you've set up authentication. These policies control who can view, create, and update tickets.

## Sample Data

The schema includes commented sample data that you can uncomment to populate your database with test records.

## Next Steps

After setting up the database:

1. Configure your environment variables in your application:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Update your application code to use the new schema if necessary.

3. Consider enabling and customizing the Row Level Security policies based on your authentication requirements. 