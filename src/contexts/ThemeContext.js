import React, { createContext, useContext, useState, useEffect } from 'react';

// إنشاء سياق للوضع المظلم
const ThemeContext = createContext();

// مزود السياق للوضع المظلم
export const ThemeProvider = ({ children }) => {
  // التحقق من وجود تفضيل مخزن محليًا
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme_preference');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // التحقق من تفضيلات النظام
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };
  
  const [theme, setTheme] = useState(getSavedTheme);
  const [isSystemTheme, setIsSystemTheme] = useState(false);
  
  // تحديث السمة عند تغييرها
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // حفظ التفضيل في التخزين المحلي
    if (!isSystemTheme) {
      localStorage.setItem('theme_preference', theme);
    }
  }, [theme, isSystemTheme]);
  
  // الاستماع لتغييرات تفضيلات النظام
  useEffect(() => {
    if (!isSystemTheme) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);
  
  // تبديل الوضع المظلم
  const toggleTheme = () => {
    setIsSystemTheme(false);
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // تعيين الوضع المظلم
  const setDarkMode = (isDark) => {
    setIsSystemTheme(false);
    setTheme(isDark ? 'dark' : 'light');
  };
  
  // استخدام تفضيلات النظام
  const useSystemTheme = () => {
    setIsSystemTheme(true);
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    localStorage.removeItem('theme_preference');
  };
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode: theme === 'dark', 
      toggleTheme, 
      setDarkMode, 
      useSystemTheme,
      isSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// هوك مخصص لاستخدام سياق الوضع المظلم
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// مكون واجهة المستخدم لتبديل الوضع المظلم
export const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isDarkMode ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
      } ${className}`}
      aria-label={isDarkMode ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع المظلم'}
    >
      <span
        className={`${
          isDarkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
};

// مكون إعدادات السمة
export const ThemeSettings = ({ className = '' }) => {
  const { isDarkMode, setDarkMode, useSystemTheme, isSystemTheme } = useTheme();
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-bold text-lg">إعدادات المظهر</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => setDarkMode(false)}
          className={`w-full flex items-center justify-between p-3 rounded-lg ${
            !isDarkMode && !isSystemTheme
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-yellow-400 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span>وضع فاتح</span>
          </div>
          {!isDarkMode && !isSystemTheme && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => setDarkMode(true)}
          className={`w-full flex items-center justify-between p-3 rounded-lg ${
            isDarkMode && !isSystemTheme
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-indigo-900 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span>وضع مظلم</span>
          </div>
          {isDarkMode && !isSystemTheme && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <button
          onClick={useSystemTheme}
          className={`w-full flex items-center justify-between p-3 rounded-lg ${
            isSystemTheme
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-neutral-400 dark:bg-neutral-600 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span>تفضيلات النظام</span>
          </div>
          {isSystemTheme && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
