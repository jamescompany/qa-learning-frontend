export const formatCurrency = (amount: number, locale: string): string => {
  const isKorean = locale === 'ko';
  
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: isKorean ? 'KRW' : 'USD',
    minimumFractionDigits: isKorean ? 0 : 2,
    maximumFractionDigits: isKorean ? 0 : 2,
  };
  
  return new Intl.NumberFormat(isKorean ? 'ko-KR' : 'en-US', options).format(amount);
};

export const getCurrencySymbol = (locale: string): string => {
  return locale === 'ko' ? '₩' : '$';
};

export const convertCurrency = (amount: number, fromLocale: string, toLocale: string): number => {
  // 간단한 환율 변환 (실제로는 API를 사용해야 함)
  const exchangeRate = 1300; // 1 USD = 1300 KRW (예시)
  
  if (fromLocale === 'en' && toLocale === 'ko') {
    return amount * exchangeRate;
  } else if (fromLocale === 'ko' && toLocale === 'en') {
    return amount / exchangeRate;
  }
  
  return amount;
};