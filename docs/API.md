# API Documentation

## Authentication

### POST /api/auth/telegram
Authenticate user with Telegram WebApp data.

**Request Body:**
```json
{
  "telegramId": 123456789,
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  "photoUrl": "https://...",
  "hash": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "telegramId": 123456789,
    "username": "john_doe",
    "referralCode": "ABC123"
  }
}
```

## User Endpoints

### GET /api/user/profile
Get user profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "John",
    "totalBalance": 50000,
    "mainBalance": 30000,
    "investmentBalance": 15000,
    "referralBalance": 5000,
    "taskBalance": 0
  }
}
```

## Wallet Endpoints

### GET /api/wallet
Get wallet information.

**Response:**
```json
{
  "success": true,
  "wallet": {
    "mainBalance": 30000,
    "investmentBalance": 15000,
    "referralBalance": 5000,
    "taskBalance": 0,
    "totalBalance": 50000
  }
}
```

### GET /api/wallet/history
Get transaction history.

**Query Parameters:**
- `limit` (default: 50)
- `offset` (default: 0)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "type": "deposit",
      "amount": 10000,
      "status": "completed",
      "createdAt": "2026-07-22T10:00:00Z"
    }
  ]
}
```

## Investment Endpoints

### GET /api/investment/plans
Get available investment plans.

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "name": "Gold Plan",
      "minimumAmount": 50000,
      "maximumAmount": 200000,
      "dailyProfitPercentage": 2,
      "durationDays": 30,
      "roiPercentage": 60
    }
  ]
}
```

### GET /api/investment/my-investments
Get user's active investments.

**Response:**
```json
{
  "success": true,
  "investments": [
    {
      "id": "uuid",
      "planName": "Gold Plan",
      "amount": 100000,
      "dailyProfit": 2000,
      "earnedProfit": 8000,
      "status": "active",
      "daysCompleted": 4
    }
  ]
}
```

### POST /api/investment/create
Create a new investment.

**Request Body:**
```json
{
  "planId": "uuid",
  "amount": 100000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment created successfully",
  "investment": {
    "id": "uuid",
    "amount": 100000,
    "dailyProfit": 2000,
    "totalProfit": 60000,
    "status": "active"
  }
}
```

## Deposit Endpoints

### POST /api/deposit/request
Request a deposit.

**Request Body:**
```json
{
  "amount": 50000,
  "paymentMethod": "bank_transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit request submitted successfully",
  "deposit": {
    "id": "uuid",
    "amount": 50000,
    "status": "pending"
  }
}
```

### GET /api/deposit/my-deposits
Get user's deposits.

**Response:**
```json
{
  "success": true,
  "deposits": [
    {
      "id": "uuid",
      "amount": 50000,
      "status": "approved",
      "createdAt": "2026-07-22T10:00:00Z",
      "approvedAt": "2026-07-22T10:30:00Z"
    }
  ]
}
```

## Admin Endpoints

### GET /api/admin/users
Get all users (admin only).

**Query Parameters:**
- `search` - Search by name or username
- `limit` (default: 50)
- `offset` (default: 0)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "firstName": "John",
      "username": "john_doe",
      "accountStatus": "active",
      "totalBalance": 50000
    }
  ]
}
```

### GET /api/admin/deposits/pending
Get pending deposits (admin only).

**Response:**
```json
{
  "success": true,
  "deposits": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 50000,
      "status": "pending",
      "createdAt": "2026-07-22T10:00:00Z"
    }
  ]
}
```

### POST /api/admin/deposits/{depositId}/approve
Approve a deposit (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Deposit approved successfully"
}
```

### POST /api/admin/deposits/{depositId}/reject
Reject a deposit (admin only).

**Request Body:**
```json
{
  "reason": "Insufficient funds"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit rejected successfully"
}
```

### GET /api/admin/statistics
Get platform statistics (admin only).

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1500,
    "activeUsers": 1200,
    "totalDeposited": 5000000,
    "totalWithdrawn": 2000000,
    "pendingDeposits": 50,
    "pendingWithdrawals": 30
  }
}
```
