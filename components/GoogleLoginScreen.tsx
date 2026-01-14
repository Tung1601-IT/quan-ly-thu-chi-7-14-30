import React from 'react';

const GoogleIcon: React.FC = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M24 9.8c3.3 0 5.8 1.4 7.6 3.1l6-6C33.3 2.8 29.1 1 24 1 14.5 1 6.5 6.8 3.3 15.1l7.4 5.8C12.4 14.9 17.7 9.8 24 9.8z"></path>
        <path fill="#34A853" d="M24 47c5.4 0 10-1.8 13.4-4.9l-6.8-5.3c-1.8 1.2-4.1 1.9-6.6 1.9-6.3 0-11.6-4.2-13.5-9.9l-7.4 5.8C6.5 40.2 14.5 47 24 47z"></path>
        <path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.4-5.8C1.5 16.6 1 20.2 1 24s.5 7.4 2.9 10.3l7.6-5.8z"></path>
        <path fill="#EA4335" d="M24 18.8c-3.1 0-5.7 1.3-7.4 2.9l6.8 5.3c1.8-1.7 3.9-2.6 6.6-2.6 3.9 0 7.2 1.6 9.5 4.1l6.8-5.3C38.1 14.6 31.9 9.8 24 9.8v9z"></path>
    </svg>
);


interface GoogleLoginScreenProps {
  onContinue: () => void;
  onCancel: () => void;
}

const GoogleLoginScreen: React.FC<GoogleLoginScreenProps> = ({ onContinue, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="p-6">
          <header className="mb-4">
            <h1 className="text-xl font-medium text-gray-900 text-center">Đăng nhập bằng Google</h1>
          </header>

          <main>
            <div className="flex items-center p-4 border rounded-md">
                <GoogleIcon />
                <div className="ml-4">
                    <p className="font-semibold text-gray-800">Tài khoản Google</p>
                    <p className="text-sm text-gray-600">nguyenvana@gmail.com</p>
                </div>
            </div>
          </main>
        </div>

        <footer className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Tiếp tục
          </button>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in-up {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default GoogleLoginScreen;