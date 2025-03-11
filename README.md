# Ticket Management System

A modern ticket management system built with Next.js 15, shadcn UI components, Tailwind CSS, TypeScript, and Supabase.

## Features

- View tickets in a clean, sortable table layout
- Create new tickets via a slide-out drawer
- Track ticket status and priority
- Add comments to tickets
- Tag tickets for better organization
- Track ticket history and changes
- Modern UI with shadcn components
- Responsive design for all devices
- Real-time updates with Supabase

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn UI
- Supabase (Backend & Database)
- React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account

### Setup Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Set up the database schema using one of the following methods:

   **Option 1: Using the Supabase SQL Editor**
   - Navigate to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of the `db/schema.sql` file
   - Run the query to create all tables, constraints, and functions

   **Option 2: Using the Supabase CLI**
   - Install the Supabase CLI: `npm install -g supabase`
   - Log in: `supabase login`
   - Link your project: `supabase link --project-ref your-project-ref`
   - Apply the migration: `supabase db push`

3. Get your Supabase URL and anon key from the project settings

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses a relational database schema with the following tables:

- **tickets**: Main table for storing ticket information
- **ticket_comments**: Stores comments and discussions related to tickets
- **ticket_history**: Tracks changes made to tickets for audit purposes
- **tags**: Stores available tags for categorizing tickets
- **ticket_tags**: Junction table for the many-to-many relationship between tickets and tags

For a complete database schema and setup instructions, see the files in the `db/` directory:
- `schema.sql`: Complete SQL schema definition
- `setup_instructions.md`: Detailed setup instructions
- `entity_relationship_diagram.md`: Visual representation of the database structure

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fticket-management-system)

## License

This project is licensed under the MIT License. 