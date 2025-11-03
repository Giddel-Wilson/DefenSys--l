# DefenSys - AI-Powered Web Application Vulnerability Scanner

<div align="center">

🛡️ **DefenSys** is an intelligent web application vulnerability scanner that leverages advanced detection algorithms to identify, classify, and report security vulnerabilities in real-time.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Configuration](#-environment-configuration)
- [Usage Guide](#-usage-guide)
- [Email Notifications](#-email-notifications)
- [Security Features](#-security-features)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Admin Features](#-admin-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🔐 **JWT-Based Authentication** with secure token management
- 👥 **Multi-Role System** (User & Admin dashboards with granular permissions)
- 🔍 **Automated Vulnerability Scanning**
  - SQL Injection detection
  - Cross-Site Scripting (XSS) identification
  - Security headers validation
  - SSL/TLS certificate verification
  - Insecure configuration detection
  - CORS policy analysis
  - Cookie security assessment
- 📊 **Real-time Analytics Dashboard** with dynamic security scoring
- 📈 **Comprehensive Reporting** with PDF/JSON export capabilities
- 🎨 **Modern UI/UX** with Tailwind CSS and smooth animations
- 📱 **Fully Responsive** design optimized for all devices
- 🔒 **Security First** approach with best practices

### User Features
- 🚀 **Quick Scan Creation** with customizable parameters
- 📧 **Contact Admin** functionality with email notifications
- 📊 **Personal Dashboard** with scan history and statistics
- 🔍 **Vulnerability Details** with remediation recommendations
- 📄 **Export Reports** in multiple formats

### Admin Features
- 👨‍💼 **User Management** (view, suspend, ban users)
- 📈 **System-Wide Analytics** and metrics
- 📋 **Scan Monitoring** across all users
- 📊 **Detailed Reports** with comprehensive vulnerability data
- 🛡️ **Security Overview** with threat intelligence

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** SvelteKit 2.0+
- **Styling:** Tailwind CSS 3.x
- **Language:** TypeScript 5.x
- **Testing:** Vitest + Playwright

### Backend
- **Runtime:** Node.js 18+ / Bun
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer with Gmail SMTP
- **Security:** bcrypt for password hashing

### DevOps & Tools
- **Package Manager:** Bun / npm
- **Version Control:** Git
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ or **Bun** (recommended)
- **MongoDB Atlas** account (free tier available)
- **Gmail** account (for email notifications)
- **Git** for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Giddel-Wilson/DefenSys--l.git
cd DefenSys
```

2. **Install dependencies:**
```bash
bun install  # or npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#-environment-configuration))

4. **Seed the default admin account:**
```bash
bun run scripts/seed-admin.js
```

**Default Admin Credentials:**
- **Email:** `admin@defensys.com`
- **Password:** `Admin123!@#`

⚠️ **Important:** Change these credentials immediately after first login!

5. **Start the development server:**
```bash
bun dev  # or npm run dev
```

6. **Access the application:**
- Open your browser to `http://localhost:5173`
- Login with admin credentials
- Start scanning! 🚀

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/defensys?retryWrites=true&w=majority

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development

# Gmail SMTP Configuration (for admin notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Setting Up Gmail SMTP

1. **Enable 2-Step Verification** on your Gmail account
2. Go to **Google Account → Security → 2-Step Verification → App passwords**
3. Generate an **App Password** for "Mail"
4. Copy the 16-character password to `GMAIL_APP_PASSWORD` in `.env`

📚 **Detailed Setup Guide:** See [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md)

---

## 🎯 Usage Guide

### For Users

#### 1. **Sign Up / Login**
- Navigate to `/signup` to create a new account
- Or login at `/login` with existing credentials
- JWT token is stored securely in httpOnly cookies

#### 2. **Dashboard Overview**
- View your scan history
- Monitor security scores
- Access quick actions

#### 3. **Create a Scan**
- Click **"New Scan"** button
- Enter **Scan Name** (e.g., "My Website Security Audit")
- Enter **Target URL** (e.g., "https://example.com")
- Select **Scan Type:**
  - **Quick Scan** (2-3 mins): Basic security headers and SSL checks
  - **Comprehensive Scan** (5-10 mins): Full vulnerability assessment
- Click **"Start Scan"**

#### 4. **View Results**
- Monitor scan progress in real-time
- View vulnerability breakdown by severity
- See security score (0-100)
- Export reports in PDF or JSON format

#### 5. **Contact Admin**
- Click **"Contact Admin"** in dashboard
- Fill in subject and message
- Email notification sent directly to all admins
- Admins can reply directly to your email

### For Administrators

#### 1. **Admin Dashboard**
- Access comprehensive system analytics
- View all user scans
- Monitor system security score

#### 2. **User Management**
- View all registered users
- Change user roles (User ↔ Admin)
- Suspend or ban users
- View user activity logs

#### 3. **Scan Management**
- Monitor all active scans
- View detailed scan results
- Cancel running scans if needed
- Generate system-wide reports

#### 4. **Reports**
- Access aggregated security reports
- Download comprehensive vulnerability data
- Analyze trends and patterns

---

## 📧 Email Notifications

DefenSys includes a built-in email notification system for admin communication.

### Features
- ✅ **Direct email delivery** to all admin accounts
- ✅ **Reply-To support** - Admins can reply directly to users
- ✅ **HTML formatted** emails with professional design
- ✅ **User information** included (name, email, subject)
- ✅ **Automatic sender identification** - Shows user name in "From" field

### How It Works
1. User clicks **"Contact Admin"** in dashboard
2. Fills out subject and message form
3. Message is sent **directly to all admin emails**
4. **No database storage** - messages only exist in admin inboxes
5. Admin receives email showing:
   - **From:** `User Name (via DefenSys) <system-email@gmail.com>`
   - **Reply-To:** `User Name <user@email.com>`
   - **Subject:** `[DefenSys] New Message from User Name`
   - Full message content with user details

6. Admin can **reply directly** - response goes to user's email

📚 **Setup Guide:** See [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md)

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Password hashing** using bcrypt (10 salt rounds)
- **Role-based access control** (User, Admin)
- **Protected routes** with middleware validation
- **Secure cookie storage** (httpOnly, sameSite)

### Input Validation
- **Server-side validation** for all user inputs
- **Email format verification**
- **URL sanitization** for scan targets
- **SQL injection prevention** in database queries
- **XSS protection** with input escaping

### Data Protection
- **MongoDB connection encryption**
- **Environment variable security**
- **No sensitive data in logs**
- **Secure password reset** workflow (coming soon)

### Scanning Security
- **Rate limiting** on scan creation
- **Timeout protection** for long-running scans
- **Resource management** to prevent DoS
- **Sandboxed execution** of scan operations

---

## 📁 Project Structure

```
DefenSys/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts           # JWT authentication logic
│   │   │   ├── db.ts             # MongoDB connection
│   │   │   ├── email.ts          # Email notification system
│   │   │   ├── scanner.ts        # Vulnerability scanning engine
│   │   │   └── models/           # Mongoose models
│   │   │       ├── User.ts       # User schema & interface
│   │   │       ├── Scan.ts       # Scan schema & interface
│   │   │       ├── Vulnerability.ts
│   │   │       └── Message.ts
│   │   ├── components/
│   │   │   └── Navigation.svelte # Main navigation component
│   │   └── assets/               # Static assets
│   ├── routes/
│   │   ├── +page.svelte          # Landing page
│   │   ├── +layout.svelte        # Root layout
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   ├── dashboard/            # User dashboard
│   │   │   ├── +page.svelte
│   │   │   └── reports/          # User reports
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── +page.svelte
│   │   │   ├── users/            # User management
│   │   │   └── reports/          # System reports
│   │   └── api/                  # API routes
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   ├── logout/
│   │       │   └── signup/
│   │       ├── scans/            # Scan management API
│   │       │   ├── +server.ts
│   │       │   ├── create/
│   │       │   └── [id]/
│   │       ├── messages/         # Contact admin API
│   │       └── admin/
│   │           └── users/        # Admin user management
│   ├── app.html                  # HTML template
│   ├── app.css                   # Global styles
│   └── app.d.ts                  # Type definitions
├── scripts/
│   ├── seed-admin.js             # Create default admin
│   ├── create-admin.ts           # Admin creation utility
│   └── list-users.ts             # User listing tool
├── docs/
│   ├── EMAIL_SETUP.md            # Email configuration guide
│   └── CONTACT_ADMIN_FEATURE.md  # Contact feature docs
├── static/                       # Static files
├── .env.example                  # Environment template
├── .env                          # Environment variables (gitignored)
├── package.json                  # Dependencies
├── svelte.config.js              # SvelteKit config
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
└── README.md                     # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully"
}
```

#### `POST /api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### `POST /api/auth/logout`
Logout user and clear JWT token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Scan Endpoints

#### `GET /api/scans`
Get all scans for authenticated user.

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "scans": [
    {
      "id": "scan_id",
      "name": "My Website Scan",
      "targetUrl": "https://example.com",
      "status": "completed",
      "progress": 100,
      "totalVulnerabilities": 5,
      "criticalCount": 1,
      "highCount": 2,
      "createdAt": "2025-11-02T10:00:00Z"
    }
  ]
}
```

#### `POST /api/scans/create`
Create a new vulnerability scan.

**Request Body:**
```json
{
  "name": "Production API Scan",
  "targetUrl": "https://api.example.com",
  "scanType": "comprehensive"
}
```

**Response:**
```json
{
  "success": true,
  "scanId": "new_scan_id",
  "message": "Scan created successfully"
}
```

#### `GET /api/scans/[id]`
Get detailed scan results.

**Response:**
```json
{
  "success": true,
  "scan": {
    "id": "scan_id",
    "name": "My Website Scan",
    "targetUrl": "https://example.com",
    "status": "completed",
    "vulnerabilities": [...],
    "securityScore": 75
  }
}
```

#### `GET /api/scans/[id]/vulnerabilities`
Get all vulnerabilities for a specific scan.

**Response:**
```json
{
  "success": true,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "critical",
      "description": "Potential SQL injection in login form",
      "recommendation": "Use parameterized queries",
      "location": "/login"
    }
  ]
}
```

#### `GET /api/scans/[id]/export`
Export scan results (PDF/JSON).

**Query Parameters:**
- `format`: `pdf` or `json`

---

### Admin Endpoints

#### `GET /api/admin/users`
Get all users (Admin only).

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active"
    }
  ]
}
```

#### `PATCH /api/admin/users/[id]`
Update user details (Admin only).

**Request Body:**
```json
{
  "role": "admin",
  "status": "suspended"
}
```

---

### Message Endpoints

#### `POST /api/messages`
Send message to admin (authenticated users only).

**Request Body:**
```json
{
  "subject": "Need Help with Scan",
  "message": "I'm having trouble interpreting the results..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully to admin(s)"
}
```

**Note:** Message is sent directly to all admin emails. No database storage.

---

## 👨‍💼 Admin Features

### User Management
- **View all users** with filtering and search
- **Change user roles** (promote to admin or demote to user)
- **Suspend/Ban users** to restrict access
- **View user statistics** (total scans, last activity)

### System Monitoring
- **Real-time dashboard** with system-wide metrics
- **Scan monitoring** across all users
- **Security score trends** over time
- **Vulnerability statistics** by type and severity

### Reporting
- **Generate comprehensive reports** with all system data
- **Export to PDF/JSON** for sharing
- **Filter by date range** and severity
- **Vulnerability analytics** with charts

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run unit tests
bun test:unit

# Run integration tests
bun test:integration

# Run e2e tests
bun test:e2e

# Run with coverage
bun test:coverage
```

---

## 🚢 Deployment

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Environment Setup

Ensure your production `.env` includes:
- Strong `JWT_SECRET` (use a secure random string)
- Production `MONGODB_URI`
- Valid `GMAIL_APP_PASSWORD`
- `NODE_ENV=production`

### Hosting Recommendations

- **Vercel** (recommended for SvelteKit)
- **Netlify**
- **DigitalOcean App Platform**
- **Railway**
- **Heroku**

📚 **Deployment Guide:** See [SvelteKit Deployment Docs](https://kit.svelte.dev/docs/adapter-auto)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow existing code style
- Use meaningful commit messages

---

## � License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Giddel Wilson**
- GitHub: [@Giddel-Wilson](https://github.com/Giddel-Wilson)
- Repository: [DefenSys--l](https://github.com/Giddel-Wilson/DefenSys--l)

---

## 🙏 Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

## 📞 Support

Need help? Have questions?

- 📧 **Contact Admin** feature in the dashboard
- 🐛 **Report issues** on [GitHub Issues](https://github.com/Giddel-Wilson/DefenSys--l/issues)
- 📚 **Check documentation** in `/docs` folder
- 💬 **Join discussions** on GitHub Discussions

---

<div align="center">

**Made with ❤️ by Giddel Wilson**

⭐ Star this repo if you find it useful!

</div>
│   │   │   ├── db.ts           # MongoDB connection
│   │   │   ├── auth.ts         # Authentication utilities
│   │   │   ├── scanner.ts      # Vulnerability scanning engine
│   │   │   └── models/
│   │   │       ├── User.ts     # User model
│   │   │       ├── Scan.ts     # Scan model
│   │   │       └── Vulnerability.ts  # Vulnerability model
│   │   └── components/         # Svelte components
│   └── routes/
│       ├── +page.svelte        # Landing page
│       ├── login/              # Login page
│       ├── signup/             # Signup page
│       ├── dashboard/          # User dashboard
│       ├── admin/              # Admin dashboard
│       └── api/
│           ├── auth/           # Auth endpoints
│           └── scans/          # Scan management endpoints
└── scripts/
    └── seed-admin.js           # Admin seeding script
```

## 🔐 Authentication

### Security Features
- ✅ bcrypt password hashing (12 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only, secure cookies
- ✅ Strong password requirements
- ✅ Account status management (active/suspended/banned)

### User Roles

**User** - Can register, access dashboard, run scans
**Admin** - Full system access, user management, cannot self-register

## 📊 Database Schema

### Users Collection
```typescript
{
  name: string
  email: string           // Unique, lowercase
  password_hash: string
  role: 'user' | 'admin'
  status: 'active' | 'suspended' | 'banned'
  created_at: Date
  updated_at: Date
}
```

## 🎨 Design System

**Colors:** Deep Navy Blue, Blue-to-Cyan gradients, White, Light Gray
**Effects:** Glassmorphism, backdrop blur, smooth animations
**Layout:** Responsive grid, card-based architecture

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Vulnerability Scanning
- `POST /api/scans/create` - Create and start a new scan
- `GET /api/scans` - List all scans (with filters)
- `GET /api/scans/[id]` - Get scan details with vulnerabilities
- `DELETE /api/scans/[id]` - Delete a scan

## 🔧 Scripts

```bash
bun dev          # Development server
bun build        # Production build
bun preview      # Preview build
bun run check    # Type checking
bun run lint     # Lint code
bun run test     # Run tests
bun run seed:admin  # Create admin
```

## 🚀 Deployment

**Vercel (Recommended)**
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (development/production)

## 🔮 Roadmap

- [x] Authentication system
- [x] User & Admin dashboards
- [x] MongoDB integration
- [ ] ML model integration
- [ ] URL scanning
- [ ] Source code analysis
- [ ] Vulnerability reports
- [ ] Data visualization
- [ ] Activity logging
- [ ] OAuth integration
- [ ] CI/CD pipeline

## 👨‍💻 Author

**Giddel Wilson**
- GitHub: [@Giddel-Wilson](https://github.com/Giddel-Wilson)

---

<div align="center">
Made with ❤️ for cybersecurity professionals
</div>
