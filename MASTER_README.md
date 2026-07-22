# NovaVestv1 - Complete Telegram Bot & Investment Platform

**Status**: ✅ Production Ready v1.0.0

A complete, secure, production-ready investment platform built with Node.js, React, and PostgreSQL. Features a fully functional Telegram Bot and responsive Telegram Mini App with real-time synchronization.

## 🚀 Quick Links

- **[📖 Full Documentation](./docs/)**
- **[🔗 API Docs](./docs/API.md)**
- **[🗄️ Database Schema](./docs/DATABASE.md)**
- **[🚀 Deployment Guide](./docs/DEPLOYMENT.md)**
- **[🔐 Security Guide](./docs/SECURITY.md)**
- **[🏗️ Production Deployment](./docs/PRODUCTION.md)**
- **[📝 Tasks & Roadmap](./TASKS.md)**
- **[📋 Contributing](./CONTRIBUTING.md)**

## ✨ Features

### Telegram Bot 🤖
- ✅ Welcome menu with inline buttons
- ✅ /start, /balance, /referral, /investments commands
- ✅ Complete menu navigation
- ✅ Real-time notifications
- ✅ Support system
- ✅ Help documentation

### Mini App 📱
- ✅ Beautiful responsive design
- ✅ Telegram theme integration
- ✅ Dashboard with key metrics
- ✅ Wallet management
- ✅ Investment tracking
- ✅ Mobile-first experience
- ✅ Smooth animations

### Wallet System 💰
- ✅ Main balance
- ✅ Investment balance
- ✅ Referral balance  
- ✅ Task rewards balance
- ✅ Complete transaction history
- ✅ Real-time updates

### Investment Management 📈
- ✅ Multiple investment plans
- ✅ Auto-calculate daily profits
- ✅ Track ROI
- ✅ Monitor active investments
- ✅ Historical tracking

### Deposit & Withdrawal 🏦
- ✅ Multiple payment methods
- ✅ Admin approval workflow
- ✅ Automatic wallet updates
- ✅ Transaction notifications
- ✅ Receipt tracking

### Referral System 🎁
- ✅ Unique referral codes per user
- ✅ ₦500 reward on first deposit
- ✅ Referral leaderboard
- ✅ Real-time tracking
- ✅ Anti-fraud measures

### Tasks & Rewards ✅
- ✅ 12+ task types supported
- ✅ Automatic verification
- ✅ Instant reward crediting
- ✅ Duplicate prevention
- ✅ Task statistics

### Admin Dashboard 🛠️
- ✅ User management
- ✅ Deposit/Withdrawal approval
- ✅ Task verification
- ✅ Investment plan management
- ✅ Platform statistics
- ✅ Revenue tracking
- ✅ User banning/unbanning

### Security 🔐
- ✅ JWT authentication
- ✅ Telegram signature verification
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Comprehensive logging
- ✅ Error handling without leaking sensitive data

## 🏗️ Architecture

```
NovaVestv1/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── bot/              # Telegram bot handlers
│   │   ├── api/              # REST API endpoints
│   │   ├── middleware/        # Auth, validation
│   │   ├── models/            # Database models
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers
│   │   ├── config/            # Configuration
│   │   └── server.js          # Entry point
│   ├── scripts/               # DB init, migrations
│   └── package.json
├── client/                    # Frontend (React Mini App)
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/        # Reusable components
│   │   ├── store/            # Redux state
│   │   ├── services/         # API client
│   │   ├── styles/           # Tailwind CSS
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   └── package.json
├── database/                  # Database schemas
│   ├── init.sql              # Full schema
│   ├── migrations/           # Migration files
│   └── seeds/                # Sample data
├── docs/                     # Complete documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── PRODUCTION.md
├── docker-compose.yml         # Local development
├── Dockerfile.server          # Server image
├── render.yaml                # Render deployment
└── .env.example              # Example configuration
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Telegraf** - Telegram bot framework
- **JWT** - Authentication
- **Pino** - Logging
- **Joi** - Validation
- **Redis** - Caching (optional)

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Vite** - Build tool

### DevOps
- **Docker** - Containerization
- **PostgreSQL** - Database
- **Render.com** - Deployment
- **GitHub** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Telegram Bot Token (from @BotFather)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Dooze123/NovaVestv1.git
cd NovaVestv1

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Initialize database
npm run db:init

# Start development
npm run dev
```

**Access:**
- Backend API: http://localhost:3000
- Mini App: http://localhost:5173
- Health check: http://localhost:3000/health

### Using Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

### Quick Guides
1. **[API Documentation](./docs/API.md)** - All endpoints with examples
2. **[Database Schema](./docs/DATABASE.md)** - Table relationships and design
3. **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy on Render, Docker, Heroku, VPS
4. **[Security Guidelines](./docs/SECURITY.md)** - Best practices and checklists
5. **[Production Deployment](./docs/PRODUCTION.md)** - Full production setup

## 🔑 Environment Variables

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_token

# Database
DATABASE_URL=postgresql://user:pass@localhost/novavest

# Security
JWT_SECRET=your_32_char_secret_key
ADMIN_IDS=123456789

# Server
NODE_ENV=production
PORT=3000

# Limits
MIN_DEPOSIT=1000
MAX_DEPOSIT=1000000
MIN_WITHDRAWAL=500
MAX_WITHDRAWAL=500000
REFERRAL_REWARD=500
```

See [.env.example](./.env.example) for complete list.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/telegram` - Telegram login

### User
- `GET /api/user/profile` - Get profile

### Wallet
- `GET /api/wallet` - Get wallet
- `GET /api/wallet/history` - Transaction history

### Investment
- `GET /api/investment/plans` - List plans
- `GET /api/investment/my-investments` - User investments
- `POST /api/investment/create` - Create investment

### Deposit
- `POST /api/deposit/request` - Request deposit
- `GET /api/deposit/my-deposits` - Deposit history

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/deposits/pending` - Pending deposits
- `POST /api/admin/deposits/{id}/approve` - Approve deposit
- `GET /api/admin/statistics` - Platform stats

[Full API Docs](./docs/API.md)

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📈 Deployment

### Quick Deploy to Render

1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Connect repository
4. Set environment variables
5. Deploy

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

### Production Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS enabled
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Bot webhook configured
- [ ] Admin IDs configured
- [ ] Security audit completed
- [ ] Load testing passed

## 🔒 Security

Security is a top priority:

- ✅ Parameterized SQL queries
- ✅ Password hashing with bcryptjs
- ✅ JWT token validation
- ✅ Rate limiting (15 req/min)
- ✅ CORS protection
- ✅ Helmet middleware
- ✅ Input validation & sanitization
- ✅ No sensitive data in logs
- ✅ Admin authorization checks
- ✅ Duplicate transaction prevention

See [Security Guide](./docs/SECURITY.md) for comprehensive security details.

## 📱 Mini App Features

- 🎨 Modern, responsive UI
- 🌓 Telegram theme support
- ⚡ Fast loading
- 🎯 Intuitive navigation
- 📊 Real-time data
- 🔔 Notifications
- 🎬 Smooth animations
- 📱 Mobile-first design

## 🐛 Troubleshooting

### Bot not responding
```bash
# Check token
# Verify bot is running: npm run dev
# Check logs: tail -f logs/bot.log
```

### Database connection error
```bash
# Verify DATABASE_URL
# Check PostgreSQL is running
# Run migrations: npm run db:migrate
```

### Mini App won't load
```bash
# Check BACKEND_URL
# Verify API is accessible
# Check browser console for errors
```

## 📞 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issues](https://github.com/Dooze123/NovaVestv1/issues)
- 💬 [Discussions](https://github.com/Dooze123/NovaVestv1/discussions)
- 📧 support@novavest.com

## 🤝 Contributing

Contributions welcome! See [Contributing Guide](./CONTRIBUTING.md)

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## 📈 Roadmap

### v1.1 (Next)
- Multi-language support
- Email notifications
- Advanced analytics
- Admin web dashboard

### v1.2
- Mobile app (React Native)
- Crypto integration
- Video KYC
- Social features

### v2.0
- Machine learning fraud detection
- Automated trading
- Advanced portfolio analytics
- API marketplace

See [Tasks & Roadmap](./TASKS.md) for details.

## ✅ Changelog

[View full changelog](./CHANGELOG.md)

### v1.0.0 (Current)
- ✅ Complete Telegram Bot
- ✅ React Mini App
- ✅ Wallet System
- ✅ Investment Management
- ✅ Deposit/Withdrawal
- ✅ Referral Program
- ✅ Task System
- ✅ Admin Dashboard
- ✅ Complete Documentation
- ✅ Production Ready

---

**Built with ❤️ for seamless investment management**

*Questions? Check the [docs](./docs/) or open an [issue](https://github.com/Dooze123/NovaVestv1/issues)*
