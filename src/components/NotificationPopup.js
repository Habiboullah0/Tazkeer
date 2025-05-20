import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Check, Calendar, Clock, Bell } from 'lucide-react';

// مكون الإشعارات المنبثقة
const NotificationPopup = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const popupRef = useRef(null);

  // محاكاة استلام إشعارات جديدة
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        title: 'تذكير جديد',
        message: 'حان وقت صلاة العصر',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        type: Math.random() > 0.5 ? 'prayer' : 'reminder',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
      setHasNewNotifications(true);
      
      // إظهار إشعار منبثق باستخدام مكون Toast
      if (window.toast) {
        window.toast.info(`${newNotification.title}: ${newNotification.message}`);
      }
    }, 60000); // كل دقيقة
    
    // إضافة بعض الإشعارات الافتراضية
    setNotifications([
      {
        id: 1,
        title: 'تذكير بالذكر',
        message: 'سبحان الله وبحمده سبحان الله العظيم',
        time: '10:30 ص',
        type: 'reminder',
        read: false
      },
      {
        id: 2,
        title: 'وقت الصلاة',
        message: 'حان وقت صلاة الظهر',
        time: '12:15 م',
        type: 'prayer',
        read: true
      }
    ]);
    
    return () => clearInterval(interval);
  }, []);
  
  // إغلاق الإشعارات عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // تحديد الإشعار كمقروء
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setHasNewNotifications(false);
  };
  
  // حذف إشعار
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // تحديث حالة الإشعارات الجديدة
  useEffect(() => {
    if (isOpen) {
      setHasNewNotifications(false);
    }
  }, [isOpen]);
  
  return (
    <div className="relative" ref={popupRef}>
      <motion.button
        className={`relative p-2 rounded-full ${
          darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
        } transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="الإشعارات"
      >
        <Bell size={20} />
        {hasNewNotifications && (
          <motion.span
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute left-0 mt-2 w-80 rounded-xl shadow-lg overflow-hidden z-50 ${
              darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200'
            }`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-bold">الإشعارات</h3>
              <div className="flex space-x-1 rtl:space-x-reverse">
                <button
                  className={`p-1 rounded-lg text-xs ${
                    darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'
                  }`}
                  onClick={markAllAsRead}
                >
                  <Check size={16} />
                </button>
                <button
                  className={`p-1 rounded-lg text-xs ${
                    darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-neutral-500 dark:text-neutral-400">لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    className={`p-3 border-b border-neutral-200 dark:border-neutral-700 last:border-0 ${
                      !notification.read ? (darkMode ? 'bg-neutral-700/50' : 'bg-neutral-50') : ''
                    } hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            !notification.read ? 'bg-primary-500' : 'bg-transparent'
                          }`}></span>
                          <h4 className="font-bold text-sm">{notification.title}</h4>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <div className="flex items-center mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {notification.type === 'prayer' ? (
                            <Clock size={12} className="mr-1" />
                          ) : (
                            <Calendar size={12} className="mr-1" />
                          )}
                          <span>{notification.time}</span>
                        </div>
                      </div>
                      <button
                        className={`p-1 rounded-full ${
                          darkMode ? 'hover:bg-neutral-600' : 'hover:bg-neutral-200'
                        } opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 text-center">
              <button
                className={`text-xs text-primary-600 dark:text-primary-400 hover:underline`}
                onClick={() => {
                  setIsOpen(false);
                  // التنقل إلى صفحة الإشعارات
                  if (window.navigateToScreen) {
                    window.navigateToScreen('notifications');
                  }
                }}
              >
                عرض جميع الإشعارات
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPopup;
