import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// مكون التحقق من التوافق
const DeviceCompatibilityChecker = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'unknown',
    browser: 'unknown',
    os: 'unknown',
    screenSize: { width: 0, height: 0 },
    touchSupport: false,
    orientation: 'unknown',
    pixelRatio: 1
  });
  
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0
  });
  
  // تحديد معلومات الجهاز
  useEffect(() => {
    // تحديد نوع المتصفح
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let browserName = "unknown";
      
      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
      } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
      } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
      } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
      }
      
      return browserName;
    };
    
    // تحديد نظام التشغيل
    const detectOS = () => {
      const userAgent = navigator.userAgent;
      let osName = "unknown";
      
      if (userAgent.indexOf("Win") !== -1) {
        osName = "Windows";
      } else if (userAgent.indexOf("Mac") !== -1) {
        osName = "MacOS";
      } else if (userAgent.indexOf("Linux") !== -1) {
        osName = "Linux";
      } else if (userAgent.indexOf("Android") !== -1) {
        osName = "Android";
      } else if (userAgent.indexOf("iOS") !== -1 || (userAgent.indexOf("iPhone") !== -1) || (userAgent.indexOf("iPad") !== -1)) {
        osName = "iOS";
      }
      
      return osName;
    };
    
    // تحديد نوع الجهاز
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        return 'iOS Mobile';
      } else if (/Android/.test(userAgent)) {
        return 'Android Mobile';
      } else if (/Windows Phone/.test(userAgent)) {
        return 'Windows Phone';
      } else if (window.innerWidth <= 768) {
        return 'Mobile';
      } else if (window.innerWidth <= 1024) {
        return 'Tablet';
      } else {
        return 'Desktop';
      }
    };
    
    // تحديد دعم اللمس
    const detectTouchSupport = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    
    // تحديد اتجاه الشاشة
    const detectOrientation = () => {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    };
    
    // تحديث معلومات الجهاز
    const updateDeviceInfo = () => {
      setDeviceInfo({
        type: detectDeviceType(),
        browser: detectBrowser(),
        os: detectOS(),
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        touchSupport: detectTouchSupport(),
        orientation: detectOrientation(),
        pixelRatio: window.devicePixelRatio || 1
      });
    };
    
    // تحديث المعلومات عند تغيير حجم النافذة
    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);
  
  // قياس أداء التطبيق
  useEffect(() => {
    // قياس وقت التحميل
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    
    // محاكاة قياس وقت العرض
    const startRender = performance.now();
    setTimeout(() => {
      const renderTime = performance.now() - startRender;
      
      // محاكاة قياس وقت استجابة API
      const apiResponseTimes = [120, 150, 180, 200, 90];
      const avgApiResponseTime = apiResponseTimes.reduce((a, b) => a + b, 0) / apiResponseTimes.length;
      
      // محاكاة قياس استخدام الذاكرة
      const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / (1024 * 1024) : 0;
      
      setPerformanceMetrics({
        loadTime,
        renderTime,
        apiResponseTime: avgApiResponseTime,
        memoryUsage
      });
    }, 1000);
  }, []);
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 rounded-xl bg-white dark:bg-neutral-800 shadow-soft border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-xl font-bold mb-4">معلومات الجهاز</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">نوع الجهاز:</span>
              <span className="font-medium">{deviceInfo.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">المتصفح:</span>
              <span className="font-medium">{deviceInfo.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">نظام التشغيل:</span>
              <span className="font-medium">{deviceInfo.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">دعم اللمس:</span>
              <span className="font-medium">{deviceInfo.touchSupport ? 'مدعوم' : 'غير مدعوم'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">حجم الشاشة:</span>
              <span className="font-medium">{deviceInfo.screenSize.width} × {deviceInfo.screenSize.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">الاتجاه:</span>
              <span className="font-medium">{deviceInfo.orientation === 'portrait' ? 'عمودي' : 'أفقي'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">نسبة البكسل:</span>
              <span className="font-medium">{deviceInfo.pixelRatio}x</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 rounded-xl bg-white dark:bg-neutral-800 shadow-soft border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-xl font-bold mb-4">مقاييس الأداء</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-500 dark:text-neutral-400">وقت التحميل:</span>
              <span className="font-medium">{performanceMetrics.loadTime.toFixed(2)} مللي ثانية</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (performanceMetrics.loadTime / 2000) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-500 dark:text-neutral-400">وقت العرض:</span>
              <span className="font-medium">{performanceMetrics.renderTime.toFixed(2)} مللي ثانية</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (performanceMetrics.renderTime / 100) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-500 dark:text-neutral-400">وقت استجابة API:</span>
              <span className="font-medium">{performanceMetrics.apiResponseTime.toFixed(2)} مللي ثانية</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (performanceMetrics.apiResponseTime / 300) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          {performanceMetrics.memoryUsage > 0 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-neutral-500 dark:text-neutral-400">استخدام الذاكرة:</span>
                <span className="font-medium">{performanceMetrics.memoryUsage.toFixed(2)} ميجابايت</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (performanceMetrics.memoryUsage / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-4 rounded-xl bg-white dark:bg-neutral-800 shadow-soft border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-xl font-bold mb-4">اختبار التوافق</h2>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${deviceInfo.type.includes('Mobile') ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
            <span>توافق الأجهزة المحمولة: {deviceInfo.type.includes('Mobile') ? 'ممتاز' : 'جيد'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${deviceInfo.type === 'Tablet' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
            <span>توافق الأجهزة اللوحية: {deviceInfo.type === 'Tablet' ? 'ممتاز' : 'جيد'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${deviceInfo.type === 'Desktop' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
            <span>توافق أجهزة سطح المكتب: {deviceInfo.type === 'Desktop' ? 'ممتاز' : 'جيد'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${deviceInfo.touchSupport ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span>دعم شاشات اللمس: {deviceInfo.touchSupport ? 'مدعوم' : 'غير مدعوم'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${performanceMetrics.loadTime < 1000 ? 'bg-green-500' : performanceMetrics.loadTime < 2000 ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
            <span>أداء التحميل: {performanceMetrics.loadTime < 1000 ? 'ممتاز' : performanceMetrics.loadTime < 2000 ? 'جيد' : 'بطيء'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${performanceMetrics.apiResponseTime < 150 ? 'bg-green-500' : performanceMetrics.apiResponseTime < 300 ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
            <span>أداء API: {performanceMetrics.apiResponseTime < 150 ? 'ممتاز' : performanceMetrics.apiResponseTime < 300 ? 'جيد' : 'بطيء'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceCompatibilityChecker;
