# NovaVestv1 - Telegram Bot & Mini App Investment Platform

🚀 **Complete Telegram Bot + Telegram Mini App + Investment Platform**

A production-ready, secure investment platform built with Node.js (Telegraf + Express), React, and PostgreSQL. Provides seamless synchronization between Telegram Bot and Modern Web Mini App with real-time updates.

## 🌟 Features

### Telegram Bot
- Welcome command with inline main menu
- User profile management
- Wallet system (Main, Investment, Referral, Task earnings)
- Deposit & withdrawal requests
- Investment plans with auto-calculation
- Referral system with unique codes & links
- Tasks & rewards system
- Transaction history
- Real-time notifications
- Admin dashboard (approval workflows)
- Support system

### Telegram Mini App
- Beautiful, responsive React UI
- Telegram theme support (Light/Dark)
- Real-time wallet synchronization
- Dashboard with key metrics
- Investment management
- Task completion tracking
- Referral leaderboard
- Mobile-first design
- Fast loading with smooth animations

### Wallet System
- Main Wallet Balance
- Investment Earnings
- Referral Earnings
- Task Earnings
- Full transaction history with receipts

### Investment Plans
- Admin can create, edit, delete plans
- Auto-calculate daily profit
- Track ROI and duration
- Automatic daily earnings accrual
- Investment status tracking

### Referral System
- Unique referral links & codes per user
- ₦500 reward after referred user's first deposit
- Prevents fake/duplicate/self-referrals
- Referral leaderboard
- Real-time tracking

### Tasks & Rewards
- Support for 12+ task types (Telegram, Social Media, Website, Apps)
- Task verification system
- Duplicate claim prevention
- Automatic reward crediting
- Admin task management

### Admin Features
- User management & banning
- Deposit/Withdrawal approval workflows
- Investment plan management
- Task management
- Broadcast messaging
- Platform statistics & revenue dashboard
- Transaction management

### Security
- JWT authentication
- Secure environment variables
- Input validation & sanitization
- Anti-spam & anti-fraud protection
- Rate limiting
- Error logging & monitoring
- Admin authorization
- Secure database with encryption

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Bot Framework**: Telegraf (Telegram Bot API)
- **Web Framework**: Express.js
- **Database**: PostgreSQL (SQLite for dev)
- **Authentication**: JWT + Telegram WebApp Auth
- **Process Manager**: PM2

### Frontend (Mini App)
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Theme**: Telegram WebApp Theme integration

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Hosting**: Render.com (ready to deploy)
- **Version Control**: Git/GitHub
- **Environment Management**: dotenv

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 14+ (or SQLite for dev)
- npm or yarn
- Telegram Bot token (from @BotFather)

### Installation

```bash
# Clone the repository
git clone https://github.com/Dooze123/NovaVestv1.git
cd NovaVestv1

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your credentials
# - TELEGRAM_BOT_TOKEN (from @BotFather)
# - DATABASE_URL
# - ADMIN_IDS
# - JWT_SECRET
# - etc.

# Initialize database
npm run db:init

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the application
# Bot: @YourBotName on Telegram
# Mini App: http://localhost:5173
```

### Production Deployment (Render)

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy (automatic on push)

See `docs/DEPLOYMENT.md` for configuration.

## 📁 Project Structure

```
NovaVestv1/
├── server/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── bot/            # Telegram bot handlers
│   │   ├── api/            # REST API endpoints
│   │   ├── middleware/      # Auth, validation, logging
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models/schemas
│   │   ├── utils/           # Utilities & helpers
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Express app entry
│   ├── scripts/             # Database & utility scripts
│   ├── package.json         # Dependencies
│   └── .env.example         # Example environment variables
├── client/                  # Frontend (React Mini App)
│   ├── src/
│   │   ├── pages/           # React pages/screens
│   │   ├── components/      # Reusable components
│   │   ├── store/           # Redux state management
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utilities & helpers
│   │   ├── styles/          # Global styles (Tailwind)
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Dependencies
│   └── vite.config.js       # Vite configuration
├── database/                # Database schemas & migrations
│   ├── init.sql             # Initial schema
│   ├── migrations/          # Migration files
│   └── seeds/               # Seed data
├── docs/                    # Documentation
│   ├── API.md               # API documentation
│   ├── DATABASE.md          # Database schema docs
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── SECURITY.md          # Security guidelines
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.server        # Docker image definition
├── render.yaml              # Render deployment config
├── .env.example             # Example environment variables
└── README.md                # This file
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_NAME=NovaVestBot

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/novavest

# Server
NODE_ENV=production
PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d
ADMIN_IDS=123456789,987654321
```

## 📚 Documentation

See `docs/` folder for detailed documentation:
- **API.md** - Complete REST API documentation
- **DATABASE.md** - Database schema and relationships
- **DEPLOYMENT.md** - Deployment on Render, Heroku, VPS
- **SECURITY.md** - Security best practices

## 🔒 Security Features

✅ JWT-based authentication
✅ Telegram WebApp signature verification
✅ Input validation & sanitization
✅ Rate limiting
✅ CORS protection
✅ SQL injection prevention
✅ XSS protection
✅ Admin authorization checks
✅ Duplicate transaction prevention
✅ Anti-fraud measures
✅ Error logging without sensitive data

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Available Scripts

```bash
# Development
npm run dev                 # Start both server & client
npm run server:dev         # Start server only
npm run client:dev         # Start client only

# Production
npm run build              # Build for production
npm start                  # Run production server

# Database
npm run db:init            # Initialize database
npm run db:migrate         # Run migrations
npm run db:seed            # Seed sample data

# Docker
npm run docker:build       # Build Docker images
npm run docker:up          # Start Docker containers
npm run docker:down        # Stop Docker containers
npm run docker:logs        # View Docker logs

# Code Quality
npm run lint               # Run linters
npm run format             # Format code
```

## 🐛 Troubleshooting

### Bot not responding
- Check `TELEGRAM_BOT_TOKEN` is correct
- Verify bot is running: `npm run dev`
- Check logs for errors

### Mini App won't load
- Ensure `BACKEND_URL` is accessible
- Check CORS settings
- Verify JWT token is valid

### Database connection error
- Check `DATABASE_URL` format
- Verify database service is running
- Run migrations: `npm run db:migrate`

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with details
3. Contact support through the app

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request

---

**Built with ❤️ for seamless investment management**
