import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Share2, Filter, Search, ChevronRight, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useQuranVerse, useHadith } from '../hooks/useAPI';

const NotificationsScreen = ({ 
  markNotificationAsRead, 
  deleteNotification, 
  shareContent, 
  darkMode 
}) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
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

  const searchVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } }
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
          date: new Date().toLocaleDateString('ar-SA'),
          read: false
        },
        {
          id: Date.now() - 1000,
          type: 'hadith',
          content: hadith.text,
          source: `رواه ${hadith.narrator}`,
          time: new Date(Date.now() - 3600000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(Date.now() - 3600000).toLocaleDateString('ar-SA'),
          read: true
        },
        {
          id: Date.now() - 2000,
          type: 'quran',
          content: "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ",
          source: "سورة الجمعة - آية 10",
          time: new Date(Date.now() - 7200000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(Date.now() - 7200000).toLocaleDateString('ar-SA'),
          read: false
        },
        {
          id: Date.now() - 3000,
          type: 'hadith',
          content: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ",
          source: "رواه البخاري",
          time: new Date(Date.now() - 10800000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(Date.now() - 10800000).toLocaleDateString('ar-SA'),
          read: true
        }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, [verse, hadith]);
  
  // Filter notifications based on active filter and search query
  useEffect(() => {
    let filtered = [...notifications];
    
    // Apply type filter
    if (activeFilter === 'quran') {
      filtered = filtered.filter(notification => notification.type === 'quran');
    } else if (activeFilter === 'hadith') {
      filtered = filtered.filter(notification => notification.type === 'hadith');
    } else if (activeFilter === 'unread') {
      filtered = filtered.filter(notification => !notification.read);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(notification => 
        notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, activeFilter, searchQuery]);
  
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

  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
  };

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const groups = {};
    
    filteredNotifications.forEach(notification => {
      if (!groups[notification.date]) {
        groups[notification.date] = [];
      }
      groups[notification.date].push(notification);
    });
    
    return groups;
  };

  const notificationGroups = groupNotificationsByDate();

  return (
    <motion.div 
      className="space-y-4 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h2 className="text-xl font-bold font-display">الإشعارات</h2>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className={`mr-2 px-2 py-0.5 text-xs rounded-full ${
              darkMode ? 'bg-primary-700 text-primary-200' : 'bg-primary-100 text-primary-800'
            }`}>
              {notifications.filter(n => !n.read).length} جديد
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl ${
              darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="بحث"
          >
            <Search size={18} />
          </motion.button>
          
          <motion.button
            onClick={() => {}}
            className={`p-2 rounded-xl ${
              darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="تصفية"
          >
            <Filter size={18} />
          </motion.button>
        </div>
      </div>
      
      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            variants={searchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-4"
          >
            <div className={`flex items-center p-2 rounded-xl ${
              darkMode ? 'bg-neutral-700' : 'bg-neutral-100'
            }`}>
              <Search size={18} className="mx-2 opacity-70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الإشعارات..."
                className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${
                  darkMode ? 'placeholder-neutral-400' : 'placeholder-neutral-500'
                }`}
              />
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery('')}
                  className={`p-1 rounded-full ${
                    darkMode ? 'bg-neutral-600 hover:bg-neutral-500' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={14} />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filter Tabs */}
      <div className="flex space-x-2 rtl:space-x-reverse mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <motion.button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === 'all'
              ? (darkMode ? 'bg-primary-700 text-white' : 'bg-primary-100 text-primary-800')
              : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200')
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          الكل
        </motion.button>
        
        <motion.button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === 'unread'
              ? (darkMode ? 'bg-primary-700 text-white' : 'bg-primary-100 text-primary-800')
              : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200')
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          غير مقروء
        </motion.button>
        
        <motion.button
          onClick={() => setActiveFilter('quran')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === 'quran'
              ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800')
              : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200')
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          القرآن الكريم
        </motion.button>
        
        <motion.button
          onClick={() => setActiveFilter('hadith')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeFilter === 'hadith'
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800')
              : (darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200')
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          الحديث الشريف
        </motion.button>
      </div>
      
      {/* Mark All as Read Button */}
      {notifications.filter(n => !n.read).length > 0 && (
        <motion.button
          onClick={handleMarkAllAsRead}
          className={`w-full py-2 rounded-xl mb-4 flex items-center justify-center ${
            darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Check size={16} className="mr-2" />
          <span>تحديد الكل كمقروء</span>
        </motion.button>
      )}
      
      {filteredNotifications.length === 0 ? (
        <motion.div 
          className={`p-8 rounded-xl ${darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-100'} shadow-soft text-center`}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center">
            <Bell size={48} className={`${darkMode ? 'text-neutral-600' : 'text-neutral-300'} mb-4`} />
            <p className="text-lg font-arabic">لا توجد إشعارات</p>
            <p className="text-sm opacity-70 mt-2 font-arabic">
              {searchQuery 
                ? 'لا توجد نتائج تطابق بحثك' 
                : activeFilter !== 'all' 
                  ? 'لا توجد إشعارات تطابق التصفية المحددة' 
                  : 'ستظهر هنا الإشعارات الجديدة عند وصولها'}
            </p>
          </div>
        </motion.div>
      ) : (
        Object.keys(notificationGroups).map(date => (
          <div key={date} className="mb-6">
            <div className="flex items-center mb-2">
              <Calendar size={14} className="ml-1 opacity-70" />
              <h3 className="text-sm opacity-70">{date}</h3>
            </div>
            
            <div className="space-y-3">
              {notificationGroups[date].map(notification => (
                <motion.div 
                  key={notification.id} 
                  className={`p-5 rounded-xl ${
                    !notification.read 
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-neutral-800 to-neutral-800 border-r-4 border-r-primary-500 border border-neutral-700' 
                          : 'bg-white border-r-4 border-r-primary-500 border border-neutral-100')
                      : (darkMode 
                          ? 'bg-neutral-800 border border-neutral-700' 
                          : 'bg-white border border-neutral-100')
                  } shadow-soft`}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg mb-3 font-arabic">{notification.content}</p>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm opacity-70">
                        <span>{notification.source}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-current"></span>
                        <span dir="ltr">{notification.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs ${
                      notification.type === 'quran' 
                        ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800') 
                        : (darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800')
                    }`}>
                      {notification.type === 'quran' ? 'قرآن' : 'حديث'}
                    </span>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2 rtl:space-x-reverse">
                    {!notification.read && (
                      <motion.button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                          darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'
                        } transition-colors duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="تحديد كمقروء"
                      >
                        <Check size={14} className="ml-1" />
                        <span className="font-arabic">تحديد كمقروء</span>
                      </motion.button>
                    )}
                    
                    <motion.button 
                      onClick={() => handleShare(notification)}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                        darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'
                      } transition-colors duration-200`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="مشاركة"
                    >
                      <Share2 size={14} className="ml-1" />
                      <span className="font-arabic">مشاركة</span>
                    </motion.button>
                    
                    <motion.button 
                      onClick={() => handleDelete(notification.id)}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                        darkMode ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300' : 'bg-red-50 hover:bg-red-100 text-red-600'
                      } transition-colors duration-200`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="حذف"
                    >
                      <Trash2 size={14} className="ml-1" />
                      <span className="font-arabic">حذف</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
      
      {/* Load More Button */}
      {filteredNotifications.length > 5 && (
        <motion.button
          className={`w-full py-3 rounded-xl ${
            darkMode ? 'bg-neutral-800 border border-neutral-700 hover:bg-neutral-700' : 'bg-white border border-neutral-100 hover:bg-neutral-50'
          } flex items-center justify-center`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>تحميل المزيد</span>
          <ChevronRight size={16} className="mr-1 rotate-90" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default NotificationsScreen;
