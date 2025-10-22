import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageTest: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 bg-surface rounded-lg border border-white/20">
      <h2 className="text-xl font-bold mb-4">{t('language')} Test</h2>
      <p className="mb-4">{t('welcome')}</p>
      <div className="flex gap-2">
        <button 
          onClick={() => changeLanguage('en')}
          className={`px-4 py-2 rounded-lg ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}
        >
          {t('english')}
        </button>
        <button 
          onClick={() => changeLanguage('ar')}
          className={`px-4 py-2 rounded-lg ${i18n.language === 'ar' ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}
        >
          {t('arabic')}
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        Current language: {i18n.language}
      </p>
    </div>
  );
};

export default LanguageTest;