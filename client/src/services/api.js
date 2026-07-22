import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  telegram: (data) => api.post('/auth/telegram', data)
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile')
};

// Wallet
export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  getHistory: (limit = 50, offset = 0) => api.get('/wallet/history', { params: { limit, offset } })
};

// Investment
export const investmentAPI = {
  getPlans: () => api.get('/investment/plans'),
  getMyInvestments: () => api.get('/investment/my-investments'),
  createInvestment: (planId, amount) => api.post('/investment/create', { planId, amount })
};

// Deposit
export const depositAPI = {
  requestDeposit: (amount, paymentMethod) => api.post('/deposit/request', { amount, paymentMethod }),
  getMyDeposits: () => api.get('/deposit/my-deposits')
};

// Withdrawal
export const withdrawalAPI = {
  requestWithdrawal: (amount, withdrawalMethod, details) => api.post('/withdrawal/request', { amount, withdrawalMethod, ...details }),
  getMyWithdrawals: () => api.get('/withdrawal/my-withdrawals')
};

// Referral
export const referralAPI = {
  getCode: () => api.get('/referral/code'),
  getMyReferrals: () => api.get('/referral/my-referrals')
};

// Tasks
export const taskAPI = {
  getTasks: () => api.get('/task'),
  submitTask: (taskId) => api.post(`/task/submit/${taskId}`),
  getMyTasks: () => api.get('/task/my-tasks')
};

// Notifications
export const notificationAPI = {
  getNotifications: (limit = 50, offset = 0) => api.get('/notification', { params: { limit, offset } }),
  markAsRead: (notificationId) => api.patch(`/notification/${notificationId}/read`)
};

export default api;
