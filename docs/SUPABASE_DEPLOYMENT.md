# 🚀 Property Helper 2025 - Vercel + Supabase Deployment Guide

## Overview

This guide walks you through deploying Property Helper 2025 using **Vercel** (frontend) and **Supabase** (backend, database, auth, storage). This is a **serverless architecture** that eliminates server management.

## 🏗️ Architecture

- **Frontend**: Next.js 14 on Vercel
- **Backend**: Supabase Edge Functions (TypeScript/Deno)
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe/PayFast integration

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free tier available)

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose region (Cape Town or Europe for best latency)
   - Wait for setup (2-3 minutes)

2. **Run Database Schema**
   - Go to **SQL Editor** in Supabase Dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Click **"Run"** to create all tables

3. **Set Up Authentication**
   - Go to **Authentication** → **Settings**
   - Configure email templates
   - Set redirect URLs (add your Vercel domain later):
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/dashboard
     ```

4. **Create Storage Buckets**
   - Go to **Storage**
   - Create buckets: `properties`, `templates`, `assets`
   - Set public access as needed

5. **Deploy Edge Functions**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login and link project
   supabase login
   supabase link --project-ref YOUR_PROJECT_ID

   # Deploy functions
   supabase functions deploy auth
   supabase functions deploy properties
   supabase functions deploy credits
   supabase functions deploy templates
   ```

### Step 2: Deploy Frontend to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
   NEXT_PUBLIC_API_URL=https://your-project.supabase.co/functions/v1

   # Payments (optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...

   # AI Services (optional)
   OPENAI_API_KEY=sk-...
   STABILITY_API_KEY=sk-...
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Update Supabase Configuration

1. **Update Auth Redirect URLs**
   - In Supabase Dashboard → Authentication → Settings
   - Add your Vercel domain:
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/dashboard
     ```

2. **Test Authentication**
   - Try signing up/in on your Vercel app
   - Check Supabase Auth users to confirm

### Step 4: Seed Initial Data (Optional)

Run this in Supabase SQL Editor to add sample data:

```sql
-- Insert credit packages
INSERT INTO credit_packages (name, description, credits, price, currency, is_active, is_popular, sort_order) VALUES
('Starter Pack', 'Perfect for getting started', 100, 500.00, 'ZAR', true, false, 1),
('Professional Pack', 'For regular users', 500, 2000.00, 'ZAR', true, true, 2),
('Enterprise Pack', 'For power users', 1000, 3500.00, 'ZAR', true, false, 3);

-- Insert sample templates
INSERT INTO templates (name, description, category, data, is_public, user_id) VALUES
('Modern House Flyer', 'Clean, modern property flyer', 'residential',
 '{"elements": []}', true, null),
('Luxury Property Card', 'High-end property showcase', 'luxury',
 '{"elements": []}', true, null);
```

## 🔧 Configuration

### Environment Variables Reference

**Vercel Environment Variables:**
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
NEXT_PUBLIC_API_URL=https://xxxxx.supabase.co/functions/v1

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Payments (PayFast)
PAYFAST_MERCHANT_ID=10000123
PAYFAST_MERCHANT_KEY=abc123def
PAYFAST_PASSPHRASE=your-passphrase

# AI Services
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Supabase Edge Functions Environment:**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
FRONTEND_URL=https://your-app.vercel.app
```

## 🧪 Testing Deployment

### Health Checks

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **Authentication**: Try signup/signin
3. **Database**: Check Supabase Dashboard for new users
4. **Functions**: Test API calls in browser dev tools

### Common Issues

**"Function not found" errors:**
- Ensure edge functions are deployed: `supabase functions list`
- Check function URLs in Vercel env vars

**Auth redirect issues:**
- Verify redirect URLs in Supabase Auth settings
- Check Vercel domain is added to allowed origins

**CORS errors:**
- Supabase handles CORS automatically for edge functions
- Check function responses include proper headers

## 📊 Monitoring & Analytics

### Supabase Monitoring
- **Dashboard**: Real-time metrics
- **Logs**: Function execution logs
- **Database**: Query performance

### Vercel Analytics
- **Real-time**: Live visitor metrics
- **Performance**: Core Web Vitals
- **Errors**: Runtime error tracking

## 💰 Pricing

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Supabase** | 500MB DB, 50MB storage, 50K function invocations | $25/month (Pro) |
| **Vercel** | 100GB bandwidth, unlimited static sites | $20/month (Pro) |
| **Stripe** | 2.9% + 30¢ per transaction | Volume discounts |
| **Total** | ~$0/month (development) | ~$45/month (production) |

## 🔄 Updates & Maintenance

### Deploying Updates

1. **Push to GitHub** → Vercel auto-deploys
2. **Deploy Functions**: `supabase functions deploy`
3. **Database Changes**: Run migrations in SQL Editor

### Backup Strategy

- **Database**: Supabase automatic backups
- **Storage**: Supabase automatic replication
- **Code**: GitHub repository

## 🆘 Troubleshooting

### Build Failures

**Vercel Build Issues:**
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Wrong root directory (should be 'frontend')
# - Dependency conflicts
```

**Supabase Function Issues:**
```bash
# Check function logs
supabase functions logs function-name

# Redeploy functions
supabase functions deploy function-name
```

### Performance Issues

- **Cold starts**: Edge functions have cold starts (~100ms)
- **Database queries**: Use Supabase indexes
- **Large payloads**: Optimize image sizes

## 🎯 Next Steps

1. ✅ Deploy to production
2. 🔧 Configure custom domain
3. 📧 Set up email templates
4. 💳 Test payment flows
5. 📊 Set up monitoring alerts
6. 🔒 Configure security policies

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Discord**: Join Supabase/Vercel communities

---

**🎉 Congratulations!** Your Property Helper 2025 is now live with a modern, scalable serverless architecture!