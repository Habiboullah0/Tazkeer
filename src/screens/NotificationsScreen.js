import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Share2 } from 'lucide-react';
import { useQuranVerse, useHadith } from '../hooks/useAPI';

const NotificationsScreen = ({ 
  markNotificationAsRead, 
  deleteNotification, 
  shareContent, 
  darkMode 
}) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Get API data
  const { verse } = useQuranVerse();
  const { hadith } = useHadith();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Simulate notifications from local storage or API
  useEffect(() => {
    // Try to get notifications from local storage
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else if (verse && hadith) {
      // Create some initial notifications if we have verse and hadith data
      const initialNotifications = [
        {
          id: Date.now(),
          type: 'quran',
          content: verse.text,
          source: `سورة ${verse.surah} - آية ${verse.ayah}`,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          read: false
        },
        {
          id: Date.now() - 1000,
          type: 'hadith',
          content: hadith.text,
          source: `رواه ${hadith.narrator}`,
          time: new Date(Date.now() - 3600000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          read: true
        }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, [verse, hadith]);
  
  // Update local storage when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);
  
  // Handle marking notification as read
  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    markNotificationAsRead(id);
  };
  
  // Handle deleting notification
  const handleDelete = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    deleteNotification(id);
  };
  
  // Handle sharing notification content
  const handleShare = (notification) => {
    shareContent(notification.content, notification.source);
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold font-arabic">الإشعارات</h2>
        <div className="flex items-center">
          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
            {notifications.filter(n => !n.read).length}
          </span>
          <Bell size={20} className="text-primary-500" />
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <motion.div 
          className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center">
            <Bell size={48} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
            <p className="text-gray-500 dark:text-gray-400 font-arabic">لا توجد إشعارات حتى الآن</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-arabic">ستظهر هنا الإشعارات الجديدة عند وصولها</p>
          </div>
        </motion.div>
      ) : (
        notifications.map(notification => (
          <motion.div 
            key={notification.id} 
            className={`p-5 rounded-lg border ${
              !notification.read 
                ? (darkMode ? 'border-r-primary-500 border-r-4 border-gray-700 bg-gray-700' : 'border-r-primary-500 border-r-4 border-gray-200 bg-white') 
                : (darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white')
            } shadow-md`}
            variants={itemVariants}
            layout
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-lg mb-3 font-arabic">{notification.content}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{notification.source}</span>
                  <span>•</span>
                  <span dir="ltr">{notification.time}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                notification.type === 'quran' 
                  ? (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') 
                  : (darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800')
              }`}>
                {notification.type === 'quran' ? 'قرآن' : 'حديث'}
              </span>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              {!notification.read && (
                <motion.button 
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="تحديد كمقروء"
                >
                  <Check size={14} className="mr-1" />
                  <span className="font-arabic">تحديد كمقروء</span>
                </motion.button>
              )}
              
              <motion.button 
                onClick={() => handleShare(notification)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                  darkMode ? 'bg-secondary-700 hover:bg-secondary-600 text-white' : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700'
                } transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="مشاركة"
              >
                <Share2 size={14} className="mr-1" />
                <span className="font-arabic">مشاركة</span>
              </motion.button>
              
              <motion.button 
                onClick={() => handleDelete(notification.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                  darkMode ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'
                } transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="حذف"
              >
                <Trash2 size={14} className="mr-1" />
                <span className="font-arabic">حذف</span>
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default NotificationsScreen;
