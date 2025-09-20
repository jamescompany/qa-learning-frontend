import React from 'react';
import { useTranslation } from 'react-i18next';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    title: string;
    content: string;
    date: string;
    guide?: {
      steps: string[];
      note?: string;
    };
  };
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcement,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  {announcement.title}
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {announcement.content}
                  </p>
                  
                  {announcement.guide && announcement.guide.steps && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <ul className="space-y-2">
                        {announcement.guide.steps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start text-sm text-blue-800 dark:text-blue-400">
                            <span className="mr-2">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                      {announcement.guide.note && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                          <p className="text-xs text-yellow-800 dark:text-yellow-400">
                            <strong>{t('dashboard.announcements.guide.note')}:</strong> {announcement.guide.note}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    {t('dashboard.announcements.publishedOn')}: {announcement.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('common.buttons.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;