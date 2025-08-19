import React from 'react';

interface TempPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  tempPassword: string;
}

const TempPasswordModal: React.FC<TempPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  email, 
  tempPassword 
}) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            임시 비밀번호 발급 (학습용)
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  학습 목적 전용
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>이 이메일 주소는 시스템에 등록되어 있지 않습니다.</p>
                  <p>학습 목적으로 임시 비밀번호를 생성했습니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 주소
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                임시 비밀번호
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 text-sm font-mono text-gray-900 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                  {tempPassword}
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  title="Copy to clipboard"
                >
                  복사
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              * 이 비밀번호는 30분 후 만료됩니다.
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>실제 환경에서는:</strong> 등록된 이메일로만 비밀번호 재설정 링크가 발송되며,
              존재하지 않는 이메일의 경우 보안상 아무 정보도 표시되지 않습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default TempPasswordModal;