import React from 'react';
import { Bell, Clock, Settings, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "home", icon: BookOpen, label: "الرئيسية" },
    { id: "notifications", icon: Bell, label: "الإشعارات" },
    { id: "schedule", icon: Clock, label: "الجدولة" },
    { id: "favorites", icon: Heart, label: "المفضلة" },
    { id: "settings", icon: Settings, label: "الإعدادات" }
  ];

  return (
    <motion.nav 
      className={`border-t sticky bottom-0 z-10 ${
        darkMode => darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } p-2 shadow-lg`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-around">
        {navItems.map((item) => (
          <motion.button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className={`p-2 flex flex-col items-center ${
              activeTab === item.id 
                ? (darkMode => darkMode ? 'text-primary-400' : 'text-primary-600') 
                : 'text-gray-500'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={item.label}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1 font-arabic">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
