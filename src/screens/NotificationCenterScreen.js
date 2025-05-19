import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Moon, Sun, Volume2, Vibrate } from 'lucide-react';
import { usePrayerTimes } from '../hooks/useAPI';

const NotificationCenterScreen = ({ darkMode }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    sound: true,
    vibration: true,
    prayerTimes: true,
    quran: true,
    hadith: true,
    morningReminder: true,
    eveningReminder: true,
    doNotDisturb: false,
    doNotDisturbFrom: '22:00',
    doNotDisturbTo: '06:00'
  });
  
  // Get prayer times
  const { prayerTimes } = usePrayerTimes();
  
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
  
  // Load notification settings from local storage
  useEffect(() => {
    const storedSettings = localStorage.getItem('notificationSettings');
    if (storedSettings) {
      setNotificationSettings(JSON.parse(storedSettings));
    }
  }, []);
  
  // Save notification settings to local storage when they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);
  
  // Handle setting updates
  const handleUpdateSetting = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, label, icon: Icon }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {Icon && <Icon size={18} className="ml-2 text-gray-500 dark:text-gray-400" />}
        <label className="font-arabic">{label}</label>
      </div>
      <motion.div 
        onClick={onChange}
        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
          enabled 
            ? (darkMode ? 'bg-primary-600' : 'bg-primary-500') 
            : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`w-4 h-4 rounded-full bg-white`}
          animate={{ 
            x: enabled ? 24 : 0 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold font-arabic">مركز الإشعارات</h2>
      </div>
      
      {/* Notification Settings */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">إعدادات الإشعارات</h3>
        
        <div className="space-y-4">
          <ToggleSwitch 
            enabled={notificationSettings.sound} 
            onChange={() => handleUpdateSetting('sound', !notificationSettings.sound)}
            label="صوت الإشعارات"
            icon={Volume2}
          />
          
          <ToggleSwitch 
            enabled={notificationSettings.vibration} 
            onChange={() => handleUpdateSetting('vibration', !notificationSettings.vibration)}
            label="الاهتزاز"
            icon={Vibrate}
          />
          
          <ToggleSwitch 
            enabled={notificationSettings.prayerTimes} 
            onChange={() => handleUpdateSetting('prayerTimes', !notificationSettings.prayerTimes)}
            label="تذكير بمواقيت الصلاة"
            icon={Bell}
          />
          
          <ToggleSwitch 
            enabled={notificationSettings.quran} 
            onChange={() => handleUpdateSetting('quran', !notificationSettings.quran)}
            label="آيات قرآنية"
            icon={Bell}
          />
          
          <ToggleSwitch 
            enabled={notificationSettings.hadith} 
            onChange={() => handleUpdateSetting('hadith', !notificationSettings.hadith)}
            label="أحاديث نبوية"
            icon={Bell}
          />
        </div>
      </motion.div>
      
      {/* Do Not Disturb */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold font-arabic">وضع عدم الإزعاج</h3>
          <ToggleSwitch 
            enabled={notificationSettings.doNotDisturb} 
            onChange={() => handleUpdateSetting('doNotDisturb', !notificationSettings.doNotDisturb)}
            label=""
          />
        </div>
        
        {notificationSettings.doNotDisturb && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium font-arabic">من</label>
              <input
                type="time"
                value={notificationSettings.doNotDisturbFrom}
                onChange={(e) => handleUpdateSetting('doNotDisturbFrom', e.target.value)}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                    : 'bg-gray-100 border-gray-200 focus:border-primary-500'
                } border-2 focus:outline-none transition-colors duration-200`}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium font-arabic">إلى</label>
              <input
                type="time"
                value={notificationSettings.doNotDisturbTo}
                onChange={(e) => handleUpdateSetting('doNotDisturbTo', e.target.value)}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                    : 'bg-gray-100 border-gray-200 focus:border-primary-500'
                } border-2 focus:outline-none transition-colors duration-200`}
              />
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Prayer Time Notifications */}
      {prayerTimes && (
        <motion.div 
          className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-4 font-arabic">إشعارات مواقيت الصلاة</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-arabic">الفجر</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">({prayerTimes.fajr})</span>
              </div>
              <ToggleSwitch 
                enabled={true} 
                onChange={() => {}}
                label=""
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-arabic">الظهر</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">({prayerTimes.dhuhr})</span>
              </div>
              <ToggleSwitch 
                enabled={true} 
                onChange={() => {}}
                label=""
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-arabic">العصر</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">({prayerTimes.asr})</span>
              </div>
              <ToggleSwitch 
                enabled={true} 
                onChange={() => {}}
                label=""
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-arabic">المغرب</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">({prayerTimes.maghrib})</span>
              </div>
              <ToggleSwitch 
                enabled={true} 
                onChange={() => {}}
                label=""
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-arabic">العشاء</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">({prayerTimes.isha})</span>
              </div>
              <ToggleSwitch 
                enabled={true} 
                onChange={() => {}}
                label=""
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Daily Reminders */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">تذكيرات يومية</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar size={18} className="ml-2 text-gray-500 dark:text-gray-400" />
              <span className="font-arabic">أذكار الصباح</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">(06:30)</span>
            </div>
            <ToggleSwitch 
              enabled={notificationSettings.morningReminder} 
              onChange={() => handleUpdateSetting('morningReminder', !notificationSettings.morningReminder)}
              label=""
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Moon size={18} className="ml-2 text-gray-500 dark:text-gray-400" />
              <span className="font-arabic">أذكار المساء</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2" dir="ltr">(17:30)</span>
            </div>
            <ToggleSwitch 
              enabled={notificationSettings.eveningReminder} 
              onChange={() => handleUpdateSetting('eveningReminder', !notificationSettings.eveningReminder)}
              label=""
            />
          </div>
        </div>
      </motion.div>
      
      {/* Notification Tips */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-3 font-arabic">نصائح للإشعارات</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">استخدم وضع عدم الإزعاج أثناء النوم أو العمل</li>
          <li className="font-arabic">يمكنك تخصيص إشعارات مواقيت الصلاة لكل صلاة</li>
          <li className="font-arabic">تذكيرات أذكار الصباح والمساء تساعدك على الالتزام</li>
          <li className="font-arabic">يمكنك تعديل أوقات الإشعارات حسب جدولك اليومي</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default NotificationCenterScreen;
