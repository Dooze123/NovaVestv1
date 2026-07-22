# Database Schema Documentation

## Overview

NovaVest uses PostgreSQL with the following 16 main tables:

### Users
- Stores user account information
- Tracks referral codes and linked accounts
- Manages account status and KYC verification

### Wallets
- Main balance for general funds
- Investment balance for active investments
- Referral balance from referrals
- Task balance from completed tasks
- Tracks total deposited/withdrawn/earned

### Transactions
- Complete audit trail of all transactions
- Types: deposit, withdrawal, investment, referral, task_reward, roi
- Status tracking: pending, completed, failed, rejected

### Deposits
- Deposit requests with payment method
- Receipt image storage
- Admin approval workflow
- Approval tracking and reasons

### Withdrawals
- Withdrawal requests
- Bank account details
- Admin approval workflow
- Completion status

### Investment Plans
- Plan configuration by admins
- Daily profit percentage or fixed amount
- Duration and ROI settings
- Risk level classification

### Investments
- User's active investments
- Profit calculations
- Completion tracking
- ROI processing

### Referrals
- Referrer and referred user tracking
- Unique referral codes
- Reward status and amount
- First deposit tracking for reward eligibility

### Tasks
- Available tasks for users
- Task types (Telegram, Social, Website, App)
- Reward amounts
- Verification instructions

### Task Completions
- User task submissions
- Verification status
- Proof of completion
- Reward crediting

### Notifications
- User notifications
- Types: registration, deposit, withdrawal, investment, referral, task, etc.
- Read status tracking
- Importance flagging

### Admin Logs
- Admin actions audit trail
- Changes tracking
- IP and timestamp recording

### Broadcast Messages
- Admin-created broadcasts
- Scheduling support
- Delivery tracking
- Target user filtering

### Audit Trail
- Complete system audit
- User actions tracking
- Field changes
- Error logging

### Sessions
- Active user sessions
- JWT token storage
- Device and IP tracking
- Expiration management

## Relationships

```
Users (1) ← → (1) Wallets
Users (1) ← → (N) Transactions
Users (1) ← → (N) Deposits
Users (1) ← → (N) Withdrawals
Users (1) ← → (N) Investments
InvestmentPlans (1) ← → (N) Investments
Users (1) ← → (N) Referrals (as referrer)
Users (1) ← → (N) Referrals (as referred)
Users (1) ← → (N) Tasks (as creator)
Tasks (1) ← → (N) TaskCompletions
Users (1) ← → (N) TaskCompletions
Users (1) ← → (N) Notifications
Users (1) ← → (N) AdminLogs (as admin)
Users (1) ← → (N) BroadcastMessages (as creator)
Users (1) ← → (N) AuditTrail
Users (1) ← → (N) Sessions
```

## Key Indexes

- `users.telegram_id` - Fast user lookup
- `users.referral_code` - Referral code lookup
- `wallets.user_id` - Wallet access
- `transactions.user_id` - Transaction history
- `investments.status` - Investment filtering
- `deposits.status` - Pending deposit lookup
- `withdrawals.status` - Pending withdrawal lookup
- `notifications.is_read` - Unread notification filtering
- `admin_logs.created_at` - Time-based filtering
- `audit_trail.created_at` - Audit trail browsing

## Triggers

Automatic `updated_at` field update on modification for:
- users
- wallets
- deposits
- withdrawals
- investments
- investment_plans
- tasks
- referrals
- broadcast_messages

## Performance Considerations

1. **Partitioning**: Transactions table could be partitioned by month for large datasets
2. **Archival**: Completed investments and old transactions can be archived
3. **Caching**: Frequently accessed data (investment plans, active investments) can be cached
4. **Replication**: Set up read replicas for heavy query loads

## Backup Strategy

```bash
# Daily automated backups
pg_dump -U novavest_user novavest_db | gzip > /backups/novavest_$(date +%Y%m%d).sql.gz

# Weekly full backup
tar -czf /backups/novavest_full_$(date +%Y%m%d).tar.gz /var/lib/postgresql/

# Monthly off-site backup
aws s3 cp /backups/novavest_full_*.tar.gz s3://backup-bucket/
```
