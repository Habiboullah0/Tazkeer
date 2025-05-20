import React, { createContext, useContext, useState, useEffect } from 'react';
import { cacheManager } from '../services/api';

// إنشاء سياق للمزامنة
const SyncContext = createContext();

// مزود سياق المزامنة
export const SyncProvider = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncError, setSyncError] = useState(null);
  const [syncEnabled, setSyncEnabled] = useState(true);
  
  // استرجاع حالة المزامنة من التخزين المحلي
  useEffect(() => {
    const savedSyncState = localStorage.getItem('sync_state');
    if (savedSyncState) {
      const { enabled, lastSync } = JSON.parse(savedSyncState);
      setSyncEnabled(enabled);
      setLastSyncTime(lastSync);
    }
  }, []);
  
  // حفظ حالة المزامنة في التخزين المحلي
  useEffect(() => {
    localStorage.setItem('sync_state', JSON.stringify({
      enabled: syncEnabled,
      lastSync: lastSyncTime
    }));
  }, [syncEnabled, lastSyncTime]);
  
  // مزامنة البيانات مع الخادم
  const syncWithServer = async () => {
    if (!syncEnabled || syncStatus === 'syncing') return;
    
    try {
      setSyncStatus('syncing');
      setSyncProgress(0);
      setSyncError(null);
      
      // محاكاة عملية المزامنة
      await simulateSync();
      
      setLastSyncTime(new Date().toISOString());
      setSyncStatus('success');
      
      // إظهار إشعار نجاح المزامنة
      if (window.toast) {
        window.toast.success('تمت المزامنة بنجاح');
      }
    } catch (error) {
      setSyncError(error.message);
      setSyncStatus('error');
      
      // إظهار إشعار خطأ المزامنة
      if (window.toast) {
        window.toast.error(`فشلت المزامنة: ${error.message}`);
      }
    }
  };
  
  // محاكاة عملية المزامنة
  const simulateSync = () => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSyncProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };
  
  // تمكين/تعطيل المزامنة
  const toggleSync = () => {
    setSyncEnabled(prev => !prev);
  };
  
  // مسح بيانات المزامنة
  const clearSyncData = () => {
    setLastSyncTime(null);
    setSyncStatus('idle');
    setSyncProgress(0);
    setSyncError(null);
    
    // مسح التخزين المؤقت
    cacheManager.clearExpired();
    
    // إظهار إشعار مسح البيانات
    if (window.toast) {
      window.toast.info('تم مسح بيانات المزامنة');
    }
  };
  
  return (
    <SyncContext.Provider value={{
      syncStatus,
      syncProgress,
      syncError,
      lastSyncTime,
      syncEnabled,
      syncWithServer,
      toggleSync,
      clearSyncData
    }}>
      {children}
    </SyncContext.Provider>
  );
};

// هوك مخصص لاستخدام سياق المزامنة
export const useSync = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

// مكون واجهة المستخدم لإعدادات المزامنة
export const SyncSettings = ({ className = '' }) => {
  const { 
    syncStatus, 
    syncProgress, 
    syncError, 
    lastSyncTime, 
    syncEnabled, 
    syncWithServer, 
    toggleSync, 
    clearSyncData 
  } = useSync();
  
  // تنسيق وقت المزامنة
  const formatSyncTime = (timeString) => {
    if (!timeString) return 'لم تتم المزامنة بعد';
    
    const date = new Date(timeString);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-bold text-lg">إعدادات المزامنة</h3>
      
      <div className="flex items-center justify-between">
        <span>تمكين المزامنة التلقائية</span>
        <button
          onClick={toggleSync}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            syncEnabled ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
          }`}
          aria-label={syncEnabled ? 'تعطيل المزامنة' : 'تمكين المزامنة'}
        >
          <span
            className={`${
              syncEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </button>
      </div>
      
      {lastSyncTime && (
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          آخر مزامنة: {formatSyncTime(lastSyncTime)}
        </div>
      )}
      
      {syncStatus === 'syncing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>جاري المزامنة...</span>
            <span>{syncProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {syncError && (
        <div className="text-sm text-red-500 dark:text-red-400">
          خطأ: {syncError}
        </div>
      )}
      
      <div className="flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={syncWithServer}
          disabled={syncStatus === 'syncing'}
          className={`px-4 py-2 rounded-lg text-sm ${
            syncStatus === 'syncing'
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50'
          }`}
        >
          مزامنة الآن
        </button>
        
        <button
          onClick={clearSyncData}
          disabled={syncStatus === 'syncing' || !lastSyncTime}
          className={`px-4 py-2 rounded-lg text-sm ${
            syncStatus === 'syncing' || !lastSyncTime
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50'
          }`}
        >
          مسح البيانات
        </button>
      </div>
      
      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
        المزامنة تحفظ إعداداتك وتفضيلاتك عبر جميع أجهزتك
      </div>
    </div>
  );
};
