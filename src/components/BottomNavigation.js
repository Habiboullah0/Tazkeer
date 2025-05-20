import React from 'react';
import { Bell, Clock, Settings, BookOpen, Heart, Home, Calendar, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation = ({ activeTab, setActiveTab, darkMode }) => {
  const navItems = [
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "notifications", icon: Bell, label: "الإشعارات" },
    { id: "schedule", icon: Calendar, label: "الجدولة" },
    { id: "favorites", icon: Star, label: "المفضلة" },
    { id: "settings", icon: Settings, label: "الإعدادات" }
  ];

  // تأثيرات الحركة للشريط السفلي
  const barVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { y: 100, opacity: 0, transition: { duration: 0.2 } }
  };

  // تأثيرات الحركة للأزرار
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: custom * 0.05, duration: 0.2 }
    }),
    tap: { scale: 0.9 },
    hover: { scale: 1.1 }
  };

  // تأثير المؤشر النشط
  const activeIndicatorVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } }
  };

  return (
    <motion.nav 
      className={`fixed bottom-0 left-0 right-0 z-40 px-2 py-1 ${
        darkMode 
          ? 'bg-neutral-900/95 border-t border-neutral-800 backdrop-blur-sm' 
          : 'bg-white/95 border-t border-neutral-200 backdrop-blur-sm'
      } shadow-elegant`}
      variants={barVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item, index) => (
            <motion.button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`relative p-2 flex flex-col items-center justify-center rounded-xl ${
                activeTab === item.id 
                  ? darkMode ? 'text-primary-400' : 'text-primary-600'
                  : darkMode ? 'text-neutral-400' : 'text-neutral-500'
              } transition-colors duration-200`}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              custom={index}
              aria-label={item.label}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {activeTab === item.id && (
                <motion.div 
                  className={`absolute inset-0 rounded-xl ${
                    darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                  layoutId="activeTab"
                  variants={activeIndicatorVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <item.icon size={22} />
                <span className="text-xs mt-1 font-arabic">{item.label}</span>
              </div>
              
              {/* مؤشر النقطة للعنصر النشط */}
              {activeTab === item.id && (
                <motion.div 
                  className={`absolute -top-1 h-1 w-1 rounded-full ${
                    darkMode ? 'bg-primary-400' : 'bg-primary-600'
                  }`}
                  layoutId="activeTabDot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* زر البحث العائم */}
      <motion.button
        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode 
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
        } shadow-elegant`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
      >
        <Search size={20} />
      </motion.button>
    </motion.nav>
  );
};

export default BottomNavigation;
