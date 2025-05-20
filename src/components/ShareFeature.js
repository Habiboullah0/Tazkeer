import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Twitter, Facebook, WhatsApp, Link as LinkIcon } from 'lucide-react';

// مكون المشاركة المتقدم
const ShareFeature = ({ content, title, url, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStats, setShareStats] = useState({
    copies: 0,
    shares: 0
  });
  
  // إغلاق قائمة المشاركة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.share-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // إعادة تعيين حالة النسخ بعد فترة
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // نسخ المحتوى إلى الحافظة
  const copyToClipboard = async () => {
    try {
      const textToCopy = `${content}\n${title}\n${url || window.location.href}`;
      await navigator.clipboard.writeText(textToCopy);
      
      setCopied(true);
      setShareStats(prev => ({ ...prev, copies: prev.copies + 1 }));
      
      // إظهار إشعار نجاح النسخ
      if (window.toast) {
        window.toast.success('تم نسخ المحتوى إلى الحافظة');
      }
    } catch (error) {
      console.error('فشل نسخ النص:', error);
      
      // إظهار إشعار فشل النسخ
      if (window.toast) {
        window.toast.error('فشل نسخ النص');
      }
    }
  };
  
  // مشاركة المحتوى عبر واجهة برمجة المشاركة
  const shareContent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'مشاركة من تطبيق تذكير',
          text: content,
          url: url || window.location.href
        });
        
        setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }));
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('فشل المشاركة:', error);
    }
  };
  
  // مشاركة على تويتر
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(url || window.location.href)}`;
    window.open(twitterUrl, '_blank');
    setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }));
    setIsOpen(false);
  };
  
  // مشاركة على فيسبوك
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}&quote=${encodeURIComponent(content)}`;
    window.open(facebookUrl, '_blank');
    setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }));
    setIsOpen(false);
  };
  
  // مشاركة على واتساب
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${content}\n${url || window.location.href}`)}`;
    window.open(whatsappUrl, '_blank');
    setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }));
    setIsOpen(false);
  };
  
  // مؤثرات الحركة
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } }
  };
  
  return (
    <div className="share-container relative inline-block">
      <motion.button
        onClick={shareContent}
        className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg ${
          darkMode 
            ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' 
            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
        }`}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="مشاركة"
      >
        <Share2 size={16} />
        <span>مشاركة</span>
      </motion.button>
      
      {isOpen && (
        <motion.div
          className={`absolute bottom-full mb-2 left-0 p-2 rounded-xl shadow-lg z-10 ${
            darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200'
          }`}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="grid grid-cols-2 gap-2 min-w-[200px]">
            <motion.button
              onClick={copyToClipboard}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-neutral-700' 
                  : 'hover:bg-neutral-100'
              } ${copied ? 'text-green-500' : ''}`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Copy size={16} />
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </motion.button>
            
            <motion.button
              onClick={shareOnTwitter}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-neutral-700 text-blue-400' 
                  : 'hover:bg-neutral-100 text-blue-500'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Twitter size={16} />
              <span>تويتر</span>
            </motion.button>
            
            <motion.button
              onClick={shareOnFacebook}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-neutral-700 text-blue-600' 
                  : 'hover:bg-neutral-100 text-blue-700'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Facebook size={16} />
              <span>فيسبوك</span>
            </motion.button>
            
            <motion.button
              onClick={shareOnWhatsApp}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-neutral-700 text-green-400' 
                  : 'hover:bg-neutral-100 text-green-500'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <WhatsApp size={16} />
              <span>واتساب</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                copyToClipboard();
                setIsOpen(false);
              }}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg col-span-2 ${
                darkMode 
                  ? 'hover:bg-neutral-700' 
                  : 'hover:bg-neutral-100'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <LinkIcon size={16} />
              <span>نسخ الرابط</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShareFeature;
