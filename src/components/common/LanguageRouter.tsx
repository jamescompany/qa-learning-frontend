import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageRouterProps {
  ko: React.ComponentType;
  en: React.ComponentType;
}

const LanguageRouter: React.FC<LanguageRouterProps> = ({ ko: KoComponent, en: EnComponent }) => {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  return isKorean ? <KoComponent /> : <EnComponent />;
};

export default LanguageRouter;