# StudyBridge

A comprehensive platform designed to simplify the study abroad journey for international students. StudyBridge connects students with universities, scholarships, visa information, and peer reviews in one integrated ecosystem.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D5.0.0-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Students
- **University Discovery**: Search and explore 10,000+ universities worldwide with detailed information
- **Scholarship Finder**: Discover and track scholarship opportunities tailored to your profile
- **Application Management**: Track applications, manage documents, and monitor deadlines
- **Visa Guidance**: Country-specific visa guides and requirements
- **Peer Reviews**: Read and contribute reviews from current students
- **Application Tracker**: Monitor your application status in real-time
- **Saved Lists**: Bookmark universities and scholarships for later

### For Universities & Administrators
- **Student Analytics**: Track student interest and applications
- **Scholarship Management**: Create and manage scholarship offerings
- **Dashboard**: Real-time insights and reporting
- **User Management**: Admin controls for moderation and support

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Local, Google, Facebook, LinkedIn OAuth)
- **Real-time**: Socket.io
- **Email**: Nodemailer with queue system
- **File Upload**: Multer with image optimization
- **API Docs**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **Date Management**: date-fns
- **Styling**: Tailwind CSS + MUI

### DevOps
- **Containerization**: Docker & Docker Compose
- **Environment**: Development, Staging, Production
- **CI/CD**: GitHub Actions
- **Database**: MongoDB Atlas

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **MongoDB**: (Optional - uses in-memory DB for development)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/richardfacman/Study-Bridge.git
cd Study-Bridge
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

Or use the shortcut:
```bash
npm run install-all
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/dbname

# Frontend
CLIENT_URL=http://localhost:5174

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=StudyBridge
```

## ⚡ Quick Start

### Using Auto-Start Scripts

**Windows (Command Prompt)**:
```bash
START_HERE.bat
```

**Windows (PowerShell)**:
```powershell
.\start-all-single-window.ps1
```

**macOS/Linux**:
```bash
npm run dev
```

### Manual Start

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Backend running at http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5174
```

Then open your browser and navigate to: **http://localhost:5174**

## 📁 Project Structure

```
StudyBridge/
├── backend/                          # Node.js/Express API
│   ├── config/                       # Configuration files
│   │   ├── database.js              # MongoDB connection
│   │   ├── passport.js              # Authentication strategies
│   │   ├── socket.js                # WebSocket setup
│   │   └── emailTemplates.js        # Email templates
│   ├── controllers/                  # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── universityController.js
│   │   ├── scholarshipController.js
│   │   ├── applicationController.js
│   │   └── ...
│   ├── models/                       # Database schemas
│   │   ├── User.js
│   │   ├── University.js
│   │   ├── Scholarship.js
│   │   └── ...
│   ├── routes/                       # API routes
│   ├── middleware/                   # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/                        # Utility functions
│   ├── scripts/                      # Database scripts
│   ├── tests/                        # Unit & integration tests
│   └── server.js                     # Entry point
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Auth/
│   │   │   ├── layout/
│   │   │   ├── dashboard/
│   │   │   └── common/
│   │   ├── pages/                   # Page components
│   │   │   ├── dashboard/
│   │   │   ├── universities/
│   │   │   ├── scholarships/
│   │   │   └── ...
│   │   ├── services/                # API services
│   │   ├── hooks/                   # Custom hooks
│   │   ├── store/                   # State management (Zustand)
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                       # Static assets
│   └── package.json
│
├── docker-compose.yml               # Docker Compose configuration
├── package.json                     # Root package.json
├── README.md                        # This file
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── API_DOCUMENTATION.md             # API reference
└── DEPLOYMENT.md                    # Deployment guide

```

## 📚 API Documentation

Full API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/universities` - List universities
- `GET /api/universities/:id` - Get university details
- `GET /api/scholarships` - Search scholarships
- `POST /api/applications` - Create application
- `GET /api/visa` - Get visa information

## ⚙️ Configuration

### Environment Modes

- **Development**: In-memory database, hot reload enabled
- **Staging**: Full MongoDB, rate limiting enabled
- **Production**: Optimized builds, security hardening

### Database Configuration

The application supports:
- **MongoDB Atlas** (Cloud - Production)
- **Local MongoDB** (Development)
- **In-Memory** (Testing/Development fallback)

### Authentication Providers

- Local (Email/Password)
- Google OAuth 2.0
- Facebook OAuth
- LinkedIn OAuth

## 💻 Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Database Seeding

```bash
cd backend
npm run seed
```

## 🐳 Docker Setup

Build and run with Docker:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## 📖 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:

- Heroku deployment
- AWS deployment
- Docker container deployment
- GitHub Actions CI/CD setup
- Production configuration

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for our code standards and guidelines.

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill existing Node processes
# Windows
taskkill /IM node.exe /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Dependencies Issues**
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

**Database Connection Error**
- Check MongoDB connection string in `.env`
- Ensure network access is enabled in MongoDB Atlas
- Verify IP whitelist includes your current IP

For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

**Richard Facman** - Project Creator and Lead Developer

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- The open-source community for excellent tools and libraries

## 📞 Support

For support, please:
- Create an issue on [GitHub Issues](https://github.com/richardfacman/Study-Bridge/issues)
- Check existing documentation
- Review the [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🔗 Links

- [Live Demo](https://studybridge-demo.vercel.app)
- [API Documentation](./API_DOCUMENTATION.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [GitHub Repository](https://github.com/richardfacman/Study-Bridge)

---

**Last Updated**: May 2026

Made with ❤️ for international students worldwide
