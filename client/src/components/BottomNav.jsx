import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '💰', label: 'Wallet', path: '/wallet' },
    { icon: '📈', label: 'Invest', path: '/investment' },
    { icon: '👥', label: 'Referral', path: '/referral' },
    { icon: '⚙️', label: 'Settings', path: '/settings' }
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2"
      style={{ zIndex: 1000 }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center gap-1 p-2 flex-1"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs text-gray-600">{item.label}</span>
        </button>
      ))}
    </motion.div>
  );
};

export default BottomNav;
