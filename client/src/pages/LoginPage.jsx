import React from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const handleTelegramLogin = async () => {
    // This will be handled by Telegram WebApp API
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const user = webApp.initDataUnsafe?.user;

      if (user) {
        // Send to backend for authentication
        try {
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId: user.id,
              username: user.username,
              firstName: user.first_name,
              lastName: user.last_name,
              photoUrl: null
            })
          });
          const data = await response.json();
          if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.reload();
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      }
    }
  };

  React.useEffect(() => {
    handleTelegramLogin();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-center text-white"
      >
        <h1 className="text-5xl font-bold mb-4">🚀 NovaVest</h1>
        <p className="text-xl mb-8">Investment Platform</p>
        <p className="text-gray-200">Authenticating with Telegram...</p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
