# Flight Manager CRM

A modern web application for managing flight bookings and client data, built with Next.js, TypeScript, and Supabase.

## Features

- 🔐 Secure authentication with Supabase Auth
- 📊 Real-time dashboard with key statistics
- 👥 Client management system
- ✈️ Flight booking and management
- 🔍 Advanced search and filtering
- 📝 Activity logging
- 💰 Payment tracking

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Headless UI, Heroicons
- **Form Handling**: React Hook Form, Zod

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Clients Table
- id (Primary Key)
- first_name
- last_name
- email
- phone
- birthday
- service_type (Paid/Free)

### Flights Table
- id (Primary Key)
- client_id (Foreign Key)
- flight_date
- cost_type (Paid/Free)
- charged_amount
- currency (₪ or $)
- amount_due
- payment_status (Paid/Unpaid)
- flight_status (Upcoming/Completed/Canceled)

### Activity Log Table
- id (Primary Key)
- client_id (Foreign Key)
- action
- timestamp

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
