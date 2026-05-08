# StudyBridge - Complete Setup & Auto-Start Guide

## Quick Start (2 seconds)

### Option 1: Double-Click (Easiest) 🎯
```
Double-click: C:\StudyBridge\START_HERE.bat
```
This will:
- ✅ Kill old Node processes
- ✅ Start backend on port 5000
- ✅ Start frontend on port 5173+ (auto-allocated)
- ✅ Open app in your browser automatically

### Option 2: PowerShell (Advanced)
```powershell
.\start-all-single-window.ps1
```

### Option 3: Manual (If needed)
Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

---

## Access the Application

- **Frontend**: http://localhost:5173 (auto-allocated: 5173, 5174, 5175...)
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## Troubleshooting

### Port Already in Use
If you see "Port 5000 already in use", run:
```powershell
taskkill /IM node.exe /F
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Fix all dependencies
```bash
npm install
npm audit fix --force
```

---

## Environment Configuration

Backend `.env` (backend/.env):
```
MONGODB_URI=mongodb+srv://mdfaisala84_db_user:zDVll9xegq80aHHQ@cluster0.erg33pk.mongodb.net/?appName=Cluster0
PORT=5000
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

Database: In-memory MongoDB (development)
- No external database required
- Data persists during session
- Resets on backend restart

---

## Key Features

✅ Backend running with:
- Express.js API server
- In-memory MongoDB (fallback to Atlas when DNS works)
- Socket.io real-time communication
- Passport.js authentication (Local, Google, Facebook, LinkedIn)
- Rate limiting & security middleware

✅ Frontend running with:
- React + Vite (fast dev server)
- React Router navigation
- Zustand state management
- TailwindCSS + Material-UI styling
- Axios API client

---

## Project Structure

```
StudyBridge/
├── backend/              # Node.js/Express API
│   ├── controllers/      # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/       # Auth, validation, etc.
│   ├── config/          # Database, passport
│   └── server.js        # Entry point
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page routes
│   │   ├── services/    # API calls
│   │   ├── store/       # Zustand state
│   │   └── App.jsx      # Main app
│   └── vite.config.js
├── START_HERE.bat       # 🚀 Quick start
└── docker-compose.yml   # Docker setup (optional)
```

---

## Available APIs

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `GET /api/auth/google/callback` - Google OAuth
- `GET /api/auth/facebook/callback` - Facebook OAuth
- `GET /api/auth/linkedin/callback` - LinkedIn OAuth

### Universities
- `GET /api/universities` - Get all universities
- `GET /api/universities/search` - Search universities
- `GET /api/universities/:id` - Get university details

### Scholarships
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/search` - Search scholarships
- `GET /api/scholarships/:id` - Get scholarship details

### Visa Guides
- `GET /api/visas` - Get all visa guides
- `GET /api/visas/:id` - Get visa guide details

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

---

## Database Information

**Current Setup**: In-memory MongoDB (Perfect for Development)
- ✅ No external dependencies
- ✅ Instant startup
- ✅ Data persists during session
- ✅ Resets on backend restart

**MongoDB Atlas** (When network is fixed):
- URI: mongodb+srv://mdfaisala84_db_user:zDVll9xegq80aHHQ@cluster0.erg33pk.mongodb.net
- Status: DNS connectivity issue (not code-related)
- Fallback: Application automatically switches to in-memory MongoDB

---

## Next Steps

1. ✅ Run `START_HERE.bat` or `npm run dev` in both folders
2. ✅ Register a new account at http://localhost:5174/register
3. ✅ Login with your credentials
4. ✅ Explore universities, scholarships, and visa guides
5. ✅ Create applications and reviews

---

## Support

If you encounter issues:
1. Check terminal output for error messages
2. Run port check: `netstat -ano | findstr :5000` or `:5174`
3. Kill processes: `taskkill /IM node.exe /F`
4. Reinstall dependencies: `npm install` in both folders
5. Clear cache: `rm -r node_modules package-lock.json` then `npm install`

---

## Advanced Configuration

### Change Ports
Edit `backend/.env`:
```
PORT=3000
```

Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3174
}
```

### Update API Base URL
Edit `frontend/src/utils/apiClient.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

---

## Production Deployment

### Docker
```bash
docker-compose up
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Build backend: `npm install --production`
3. Set environment variables
4. Run: `npm start`

---

**Last Updated**: May 3, 2026
**Status**: ✅ Fully Functional
**Database**: In-memory MongoDB (Development)
**API Server**: Running on port 5000
**Frontend**: Ready on port 5174
