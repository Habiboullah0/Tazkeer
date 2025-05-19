import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { usePrayerTimes } from '../hooks/useAPI';

const ScheduleScreen = ({ 
  darkMode 
}) => {
  // State for schedules
  const [schedules, setSchedules] = useState([]);
  
  // Get prayer times for suggestions
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
  
  // Load schedules from local storage
  useEffect(() => {
    const storedSchedules = localStorage.getItem('schedules');
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
      // Default schedules if none exist
      const defaultSchedules = [
        { id: 1, time: "08:00", type: "quran", active: true },
        { id: 2, time: "12:30", type: "hadith", active: true },
        { id: 3, time: "17:45", type: "quran", active: true }
      ];
      setSchedules(defaultSchedules);
      localStorage.setItem('schedules', JSON.stringify(defaultSchedules));
    }
  }, []);
  
  // Save schedules to local storage when they change
  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);
  
  // Add new schedule
  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      time: "09:00",
      type: "quran",
      active: true
    };
    setSchedules([...schedules, newSchedule]);
  };
  
  // Toggle schedule active status
  const toggleSchedule = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
    ));
  };
  
  // Delete schedule
  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };
  
  // Update schedule time
  const updateScheduleTime = (id, time) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, time } : schedule
    ));
  };
  
  // Update schedule type
  const updateScheduleType = (id, type) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, type } : schedule
    ));
  };
  
  // Add prayer time schedule
  const addPrayerTimeSchedule = (prayerName, time) => {
    const newSchedule = {
      id: Date.now(),
      time: time.replace(/\s[صم]$/, ''), // Remove AM/PM indicator
      type: "prayer",
      active: true,
      prayerName
    };
    setSchedules([...schedules, newSchedule]);
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
        <h2 className="text-xl font-bold font-arabic">جدولة الإشعارات</h2>
        <motion.button 
          onClick={addSchedule}
          className={`flex items-center px-4 py-2 rounded-lg ${
            darkMode ? 'bg-primary-600 hover:bg-primary-500' : 'bg-primary-500 hover:bg-primary-600'
          } text-white transition-colors duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="إضافة جدولة جديدة"
        >
          <Plus size={18} className="mr-1" />
          <span className="font-arabic">إضافة جديد</span>
        </motion.button>
      </div>
      
      {schedules.length === 0 ? (
        <motion.div 
          className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center justify-center">
            <Clock size={48} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
            <p className="text-gray-500 dark:text-gray-400 font-arabic">لا توجد جدولة للإشعارات</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-arabic">أضف جدولة جديدة للبدء في استلام الإشعارات</p>
          </div>
        </motion.div>
      ) : (
        schedules.map(schedule => (
          <motion.div 
            key={schedule.id} 
            className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            variants={itemVariants}
            layout
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={(e) => updateScheduleTime(schedule.id, e.target.value)}
                    className={`p-3 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                        : 'bg-gray-100 border-gray-200 focus:border-primary-500'
                    } border-2 focus:outline-none transition-colors duration-200 w-full md:w-auto`}
                    dir="ltr"
                  />
                  <Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <select
                  value={schedule.type}
                  onChange={(e) => updateScheduleType(schedule.id, e.target.value)}
                  className={`p-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600 focus:border-primary-500' 
                      : 'bg-gray-100 border-gray-200 focus:border-primary-500'
                  } border-2 focus:outline-none transition-colors duration-200 w-full md:w-auto font-arabic`}
                >
                  <option value="quran">قرآن</option>
                  <option value="hadith">حديث</option>
                  <option value="prayer">صلاة</option>
                </select>
                
                {schedule.type === 'prayer' && schedule.prayerName && (
                  <span className={`px-3 py-1 rounded-lg text-sm ${
                    darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {schedule.prayerName}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button 
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                    schedule.active 
                      ? (darkMode ? 'bg-primary-700 text-white' : 'bg-primary-500 text-white') 
                      : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600')
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={schedule.active ? "تعطيل" : "تفعيل"}
                >
                  {schedule.active ? (
                    <>
                      <ToggleRight size={16} className="mr-1" />
                      <span className="font-arabic">نشط</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} className="mr-1" />
                      <span className="font-arabic">معطل</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button 
                  onClick={() => deleteSchedule(schedule.id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                    darkMode ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="حذف"
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="font-arabic">حذف</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))
      )}
      
      {/* Prayer Times Suggestions */}
      {prayerTimes && (
        <motion.div 
          className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mt-6`}
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-3 font-arabic">إضافة تذكير بمواقيت الصلاة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <motion.button
              onClick={() => addPrayerTimeSchedule('الفجر', prayerTimes.fajr)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-100 hover:bg-green-200'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-bold font-arabic">الفجر</p>
              <p dir="ltr">{prayerTimes.fajr}</p>
            </motion.button>
            
            <motion.button
              onClick={() => addPrayerTimeSchedule('الظهر', prayerTimes.dhuhr)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-bold font-arabic">الظهر</p>
              <p dir="ltr">{prayerTimes.dhuhr}</p>
            </motion.button>
            
            <motion.button
              onClick={() => addPrayerTimeSchedule('العصر', prayerTimes.asr)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-100 hover:bg-indigo-200'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-bold font-arabic">العصر</p>
              <p dir="ltr">{prayerTimes.asr}</p>
            </motion.button>
            
            <motion.button
              onClick={() => addPrayerTimeSchedule('المغرب', prayerTimes.maghrib)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-100 hover:bg-orange-200'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-bold font-arabic">المغرب</p>
              <p dir="ltr">{prayerTimes.maghrib}</p>
            </motion.button>
            
            <motion.button
              onClick={() => addPrayerTimeSchedule('العشاء', prayerTimes.isha)}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-bold font-arabic">العشاء</p>
              <p dir="ltr">{prayerTimes.isha}</p>
            </motion.button>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mt-6`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-3 font-arabic">نصائح للجدولة</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">حدد أوقات مناسبة لتلقي الإشعارات لتجنب الإزعاج</li>
          <li className="font-arabic">يمكنك تعطيل الجدولة مؤقتًا بدلاً من حذفها</li>
          <li className="font-arabic">جرب تنويع المحتوى بين القرآن والأحاديث</li>
          <li className="font-arabic">يمكنك إضافة جدولة لأوقات الصلاة للتذكير</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleScreen;
