# CA Kajal Malde Website

Professional chartered accountant services website with service management, user authentication, and admin dashboard.

## 🌟 Features

- **Authentication**: Email/Password + Google OAuth with 30-minute session timeout
- **Public Pages**: Homepage, Services listing, About page
- **User Dashboard**: Track service requests and status
- **Admin Dashboard**: 
  - Analytics with Chart.js (Pie/Bar charts)
  - Service management (Add/Edit/Delete)
  - Request management with status updates
- **Notifications**: Email notifications via SendGrid
- **Responsive Design**: Mobile-first Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase account
- SendGrid account

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Firebase and SendGrid credentials to .env.local
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- Firebase configuration
- SendGrid setup
- Twilio setup (optional, for SMS/WhatsApp)
- Deployment guide

## 🔑 Environment Variables

Required in `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=cakajalmalde08@gmail.com
```

## 📁 Project Structure

```
/app                    # Next.js App Router pages
  /admin                # Admin dashboard
  /dashboard            # User dashboard
  /login, /signup       # Auth pages
  /services             # Services listing
/components             # React components
  /admin                # Admin components
  /auth                 # Auth components
  /services             # Service components
  /ui                   # UI components
/lib                    # Utilities
  firebase.ts           # Firebase config
  firestore.ts          # Database helpers
/types                  # TypeScript definitions
```

## 👤 Admin Access

The admin email is set to: `cakajalmalde08@gmail.com`

Sign up with this email to get admin privileges and access the admin dashboard at `/admin`.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Email**: SendGrid
- **Charts**: Chart.js + react-chartjs-2
- **Deployment**: Vercel (recommended)

## 📱 Features Breakdown

### Public Features
- Browse services without login
- View service status (Available/Starting Soon/Not Available)
- Responsive design for all devices

### User Features
- Request services (requires login)
- Track request status
- View admin notes and estimated time
- Receive email confirmations

### Admin Features
- View analytics dashboard
- Add/Edit/Delete services
- Manage service requests
- Update request status
- Add admin notes
- Set estimated completion time

## 🔒 Security

- Firestore security rules for role-based access
- Session timeout after 30 minutes of inactivity
- Protected routes for authenticated users
- Admin-only routes for management

## 📄 License

Private project for CA Kajal Malde

## 📞 Contact

CA Kajal Malde  
Email: cakajalmalde08@gmail.com
