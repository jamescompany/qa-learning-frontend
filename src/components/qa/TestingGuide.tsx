import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TestScenario {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestingGuideProps {
  title: string;
  description: string;
  scenarios: TestScenario[];
  tips?: string[];
  dataTestIds?: { element: string; description: string }[];
}

const TestingGuide = ({ title, description, scenarios, tips, dataTestIds }: TestingGuideProps) => {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = useState(true);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t('testingGuide.difficulty.easy');
      case 'medium': return t('testingGuide.difficulty.medium');
      case 'hard': return t('testingGuide.difficulty.hard');
      default: return difficulty;
    }
  };

  if (!showGuide) {
    return (
      <button
        onClick={() => setShowGuide(true)}
        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('testingGuide.showGuide')}
      </button>
    );
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 relative shadow-lg">
      <button
        onClick={() => setShowGuide(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        aria-label="Close guide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-800">{t('testingGuide.scenarios')}</h3>
        
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedScenario(expandedScenario === scenario.id ? null : scenario.id)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-left font-medium text-gray-900">{scenario.title}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                  {getDifficultyLabel(scenario.difficulty)}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedScenario === scenario.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedScenario === scenario.id && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700 mb-3">{scenario.description}</p>
                
                <div className="mb-3">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{t('testingGuide.steps')}</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {scenario.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-green-900 mb-1">{t('testingGuide.expectedResult')}</h4>
                  <p className="text-sm text-green-700">{scenario.expectedResult}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {tips && Array.isArray(tips) && tips.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('testingGuide.tips')}
          </h3>
          <ul className="space-y-1 text-sm text-yellow-800">
            {Array.isArray(tips) && tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dataTestIds && Array.isArray(dataTestIds) && dataTestIds.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">{t('testingGuide.availableTestIds')}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {dataTestIds.map((item, index) => (
              <div key={index} className="flex items-center">
                <code className="bg-purple-100 px-2 py-1 rounded text-purple-800 mr-2">
                  {item.element}
                </code>
                <span className="text-purple-700 text-xs">{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingGuide;