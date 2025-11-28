# CA Kajal Malde Website - Setup Guide

This guide will walk you through setting up Firebase, SendGrid, and optionally Twilio for SMS/WhatsApp notifications.

## 📦 Prerequisites

- Node.js 18+ installed
- A Google account (for Firebase)
- A SendGrid account (free tier available)
- (Optional) A Twilio account for SMS/WhatsApp

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ca-kajal-malde-website` (or your choice)
4. Disable/Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method
   - Add your support email
   - Save

### 1.3 Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode** (we'll upload security rules)
4. Choose a location (e.g., asia-south1 for India)
5. Click "Enable"

### 1.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" → Click **Web** icon `</>`
3. Register app name: `CA Kajal Malde Website`
4. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

### 1.5 Update Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_ADMIN_EMAIL=cakajalmalde08@gmail.com
```

### 1.6 Deploy Firestore Security Rules

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
   - Select your project
   - Use `firestore.rules` as the rules file
   - Skip firestore.indexes.json
4. Deploy rules: `firebase deploy --only firestore:rules`

---

## 📧 Step 2: SendGrid Setup

### 2.1 Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day)
3. Verify your email address

### 2.2 Create API Key

1. Go to **Settings** → **API Keys**
2. Click "Create API Key"
3. Name: `CA Website Notifications`
4. Permissions: **Full Access** (or Restricted with Mail Send permission)
5. Click "Create & View"
6. **COPY THE API KEY** (you won't see it again!)

### 2.3 Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Fill in details:
   - From Name: CA Kajal Malde
   - From Email: cakajalmalde08@gmail.com (or a professional domain email)
   - Reply To: Same as above
4. Check your email and click verification link

### 2.4 Update Environment Variables

Add to `.env.local`:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=cakajalmalde08@gmail.com
```

---

## 📱 Step 3: Twilio Setup (Optional - for SMS/WhatsApp)

### 3.1 Create Twilio Account

1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for a free trial account
3. Verify your phone number

### 3.2 Get Twilio Credentials

1. Go to Twilio Console Dashboard
2. Find your **Account SID** and **Auth Token**
3. Copy both values

### 3.3 Get a Twilio Phone Number

1. Go to **Phone Numbers** → **Manage** → **Buy a number**
2. Select a number with SMS and Voice capabilities
3. Purchase the number (uses trial credit)

### 3.4 Enable WhatsApp (Optional)

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the sandbox setup instructions
3. Join the sandbox by sending the code from your phone
4. Note the WhatsApp sandbox number (e.g., `whatsapp:+14155238886`)

### 3.5 Update Environment Variables

Add to `.env.local`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 3.6 Implement Twilio in Code

The notification API route (`app/api/send-notification/route.ts`) has placeholders for Twilio.
Add this code to enable SMS/WhatsApp:

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
await client.messages.create({
  body: `New service request from ${userName} for ${service}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: adminPhoneNumber, // Add admin phone to env
});

// Send WhatsApp
await client.messages.create({
  body: `New service request from ${userName} for ${service}`,
  from: process.env.TWILIO_WHATSAPP_NUMBER,
  to: `whatsapp:${adminPhoneNumber}`,
});
```

---

## 🚀 Step 4: Running the Application

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4.3 First Time Setup - Create Admin Account

1. Sign up with `cakajalmalde08@gmail.com`
2. The system will automatically assign admin role
3. Log in and access admin dashboard at `/admin`

### 4.4 Add Initial Services

1. Go to Admin Dashboard → Services tab
2. Click "Add New Service"
3. Add services like:
   - Tax Filing & Consultation
   - Audit Services
   - Business Advisory
   - Financial Planning
   - GST Registration & Returns
   - Company Registration

---

## 🌐 Step 5: Deployment (Vercel)

### 5.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ca-website.git
git push -u origin main
```

### 5.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
6. Add Environment Variables (all from `.env.local`)
7. Click "Deploy"

### 5.3 Configure Custom Domain (Optional)

1. In Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 5.4 Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to authorized domains

---

## ✅ Testing Checklist

- [ ] Firebase Authentication working (Email + Google)
- [ ] Can create an account
- [ ] Can log in
- [ ] Session timeout works (set to 2 min for testing)
- [ ] Admin can access admin dashboard
- [ ] Regular users see user dashboard
- [ ] Can view all services
- [ ] Can request a service (logged in)
- [ ] Redirects to login if not authenticated
- [ ] Email notifications sent (check Spam folder)
- [ ] Admin can add/edit/delete services
- [ ] Admin can update request status
- [ ] User can see request status in dashboard
- [ ] Charts display correctly in admin overview
- [ ] Mobile responsive design works

---

## 🆘 Troubleshooting

### Firebase Auth Errors

- **Error: Invalid API key**: Check `.env.local` has correct Firebase config
- **Error: Unauthorized domain**: Add localhost:3000 or your domain to Firebase authorized domains

### SendGrid Errors

- **Error: Unauthorized**: Check API key is correct and has Mail Send permission
- **Error: Sender not verified**: Verify sender email in SendGrid console
- **Emails not received**: Check Spam folder, verify sender email

### Firestore Errors

- **Permission denied**: Deploy firestore.rules: `firebase deploy --only firestore:rules`
- **Document not found**: Create user document by signing up first

---

## 📞 Support

For any issues, contact: cakajalmalde08@gmail.com
