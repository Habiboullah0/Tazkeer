import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

const PerformanceTestScreen = ({ darkMode }) => {
  // Performance test results
  const performanceResults = {
    loadTime: {
      value: '1.2s',
      status: 'success',
      target: '< 2s'
    },
    firstContentfulPaint: {
      value: '0.8s',
      status: 'success',
      target: '< 1s'
    },
    timeToInteractive: {
      value: '2.5s',
      status: 'warning',
      target: '< 2s'
    },
    memoryUsage: {
      value: '45MB',
      status: 'success',
      target: '< 50MB'
    },
    apiResponseTime: {
      value: '350ms',
      status: 'warning',
      target: '< 300ms'
    },
    renderingPerformance: {
      value: '60fps',
      status: 'success',
      target: '60fps'
    }
  };
  
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
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get status color
  const getStatusColor = (status, isDark) => {
    switch (status) {
      case 'success':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'warning':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'error':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold font-arabic">اختبار الأداء</h2>
      </div>
      
      {/* Performance Overview */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">نظرة عامة على الأداء</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-green-500">4</p>
            <p className="text-sm font-arabic">معايير ناجحة</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-yellow-500">2</p>
            <p className="text-sm font-arabic">تحتاج تحسين</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-blue-500">85%</p>
            <p className="text-sm font-arabic">درجة الأداء</p>
          </div>
        </div>
      </motion.div>
      
      {/* Detailed Results */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">نتائج مفصلة</h3>
        
        <div className="space-y-4">
          {Object.entries(performanceResults).map(([key, result]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(result.status)}
                <span className="mr-2 font-arabic">
                  {key === 'loadTime' && 'وقت التحميل'}
                  {key === 'firstContentfulPaint' && 'أول عرض للمحتوى'}
                  {key === 'timeToInteractive' && 'وقت التفاعل'}
                  {key === 'memoryUsage' && 'استخدام الذاكرة'}
                  {key === 'apiResponseTime' && 'وقت استجابة API'}
                  {key === 'renderingPerformance' && 'أداء العرض'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className={`font-mono ${getStatusColor(result.status, darkMode)}`}>{result.value}</span>
                <ArrowRight size={12} className="mx-2 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">{result.target}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Responsiveness Test */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">اختبار الاستجابة</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-arabic">الهاتف المحمول (320px - 480px)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              ممتاز
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">الجهاز اللوحي (768px - 1024px)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              ممتاز
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">سطح المكتب (> 1024px)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              ممتاز
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">الاتجاه الأفقي</span>
            <span className="flex items-center text-yellow-500">
              <AlertTriangle size={16} className="ml-1" />
              جيد
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Browser Compatibility */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">توافق المتصفحات</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-arabic">كروم (أحدث إصدار)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              100%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">فايرفوكس (أحدث إصدار)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              100%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">سفاري (أحدث إصدار)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              95%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">إيدج (أحدث إصدار)</span>
            <span className="flex items-center text-green-500">
              <CheckCircle size={16} className="ml-1" />
              98%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-arabic">متصفحات قديمة</span>
            <span className="flex items-center text-yellow-500">
              <AlertTriangle size={16} className="ml-1" />
              75%
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Optimization Recommendations */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">توصيات التحسين</h3>
        
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">تحسين وقت التفاعل عن طريق تقليل عمليات JavaScript غير الضرورية</li>
          <li className="font-arabic">تحسين وقت استجابة API باستخدام تقنيات التخزين المؤقت المتقدمة</li>
          <li className="font-arabic">تحسين تجربة المستخدم في الاتجاه الأفقي على الأجهزة المحمولة</li>
          <li className="font-arabic">تحسين التوافق مع المتصفحات القديمة</li>
          <li className="font-arabic">تقليل حجم الصور وتحميلها بشكل تدريجي لتحسين الأداء</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceTestScreen;
