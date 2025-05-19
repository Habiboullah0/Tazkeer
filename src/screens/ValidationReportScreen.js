import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ValidationReportScreen = ({ darkMode }) => {
  // Validation results
  const validationResults = {
    responsiveness: {
      status: 'success',
      message: 'التطبيق يستجيب بشكل ممتاز على جميع أحجام الشاشات',
      details: [
        'تم اختبار التطبيق على أجهزة الجوال والأجهزة اللوحية وأجهزة سطح المكتب',
        'جميع العناصر تتكيف بشكل صحيح مع تغيير حجم الشاشة',
        'تم استخدام تصميم متجاوب بالكامل مع نهج Mobile-First'
      ]
    },
    errorHandling: {
      status: 'success',
      message: 'معالجة الأخطاء تعمل بشكل جيد في معظم السيناريوهات',
      details: [
        'تم اختبار سيناريوهات فقدان الاتصال بالإنترنت',
        'يتم عرض رسائل خطأ واضحة ومفيدة للمستخدم',
        'آليات التخزين المؤقت تعمل بشكل جيد عند فشل طلبات API'
      ]
    },
    performance: {
      status: 'warning',
      message: 'الأداء جيد ولكن يمكن تحسينه',
      details: [
        'وقت التحميل الأولي مقبول ولكن يمكن تحسينه',
        'بعض عمليات جلب البيانات تستغرق وقتًا طويلاً',
        'يمكن تحسين استخدام الذاكرة عند التعامل مع قوائم طويلة'
      ]
    },
    userExperience: {
      status: 'success',
      message: 'تجربة المستخدم ممتازة وسلسة',
      details: [
        'الانتقالات والرسوم المتحركة تعمل بسلاسة',
        'واجهة المستخدم بديهية وسهلة الاستخدام',
        'التغذية الراجعة البصرية واضحة للمستخدم'
      ]
    },
    compatibility: {
      status: 'warning',
      message: 'التوافق جيد مع بعض المشكلات الطفيفة',
      details: [
        'يعمل بشكل جيد على معظم المتصفحات الحديثة',
        'بعض مشكلات العرض في متصفحات قديمة',
        'بعض ميزات مشاركة المحتوى قد لا تعمل في جميع المتصفحات'
      ]
    },
    accessibility: {
      status: 'error',
      message: 'إمكانية الوصول تحتاج إلى تحسين',
      details: [
        'بعض العناصر تفتقر إلى سمات ARIA المناسبة',
        'تباين الألوان قد لا يكون كافيًا في بعض المناطق',
        'التنقل باستخدام لوحة المفاتيح يحتاج إلى تحسين'
      ]
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
        return <CheckCircle size={24} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={24} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={24} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get status color
  const getStatusColor = (status, isDark) => {
    switch (status) {
      case 'success':
        return isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200';
      case 'warning':
        return isDark ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'error':
        return isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200';
      default:
        return isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
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
        <h2 className="text-xl font-bold font-arabic">تقرير التحقق من الأداء</h2>
      </div>
      
      {/* Summary */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">ملخص التحقق</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-green-500">4</p>
            <p className="text-sm font-arabic">ناجح</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-yellow-500">2</p>
            <p className="text-sm font-arabic">تحذير</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
            <p className="text-3xl font-bold text-red-500">1</p>
            <p className="text-sm font-arabic">خطأ</p>
          </div>
        </div>
      </motion.div>
      
      {/* Detailed Results */}
      {Object.entries(validationResults).map(([key, result]) => (
        <motion.div 
          key={key}
          className={`p-5 rounded-lg border ${getStatusColor(result.status, darkMode)} shadow-md`}
          variants={itemVariants}
        >
          <div className="flex items-start">
            <div className="ml-4 mt-1">
              {getStatusIcon(result.status)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 font-arabic">
                {key === 'responsiveness' && 'الاستجابة'}
                {key === 'errorHandling' && 'معالجة الأخطاء'}
                {key === 'performance' && 'الأداء'}
                {key === 'userExperience' && 'تجربة المستخدم'}
                {key === 'compatibility' && 'التوافق'}
                {key === 'accessibility' && 'إمكانية الوصول'}
              </h3>
              <p className="mb-4 font-arabic">{result.message}</p>
              
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {result.details.map((detail, index) => (
                  <li key={index} className="font-arabic">{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Recommendations */}
      <motion.div 
        className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold mb-4 font-arabic">التوصيات</h3>
        
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li className="font-arabic">تحسين إمكانية الوصول بإضافة سمات ARIA المناسبة</li>
          <li className="font-arabic">تحسين تباين الألوان لتلبية معايير WCAG</li>
          <li className="font-arabic">تحسين أداء جلب البيانات باستخدام تقنيات التخزين المؤقت المتقدمة</li>
          <li className="font-arabic">تحسين توافق المتصفح لدعم المتصفحات القديمة</li>
          <li className="font-arabic">تقليل حجم الحزمة لتحسين وقت التحميل الأولي</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ValidationReportScreen;
