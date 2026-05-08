# Deployment Guide - StudyBridge

## Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account
- Domain name (optional)
- SSL certificate (for production)

## Environment Setup

### Production Environment Variables

Update `.env` with production values:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/studybridge

JWT_SECRET=your_strong_production_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret

# Use production OAuth credentials
GOOGLE_CLIENT_ID=production_client_id
FACEBOOK_APP_ID=production_app_id
LINKEDIN_CLIENT_ID=production_client_id

# Update callback URLs
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
FACEBOOK_CALLBACK_URL=https://api.yourdomain.com/api/auth/facebook/callback
LINKEDIN_CALLBACK_URL=https://api.yourdomain.com/api/auth/linkedin/callback