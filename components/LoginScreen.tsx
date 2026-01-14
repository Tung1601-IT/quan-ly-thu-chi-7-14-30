import React, { useState } from 'react';

const AppLogo: React.FC = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-green-500"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
    <path
      d="M12.5 11.25H14.25C14.66 11.25 15 11.59 15 12C15 12.41 14.66 12.75 14.25 12.75H12.5V14.5C12.5 14.91 12.16 15.25 11.75 15.25C11.34 15.25 11 14.91 11 14.5V12.75H9.25C8.84 12.75 8.5 12.41 8.5 12C8.5 11.59 8.84 11.25 9.25 11.25H11V9.5C11 9.09 11.34 8.75 11.75 8.75C12.16 8.75 12.5 9.09 12.5 9.5V11.25Z"
      fill="currentColor"
    />
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const AlertIcon: React.FC = () => (
     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.852-1.21 3.488 0l6.112 11.69c.636 1.21-.472 2.711-1.744 2.711H3.89c-1.272 0-2.38-1.501-1.744-2.711l6.11-11.69zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm2 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path></svg>
);

const CheckCircleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);


interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoogleLoginClick: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoogleLoginClick, onNavigateToRegister, onNavigateToForgotPassword }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    
    if (!email.trim() || !password.trim()) {
        setError('Vui lòng nhập email và mật khẩu.');
        setIsSubmitting(false);
        return;
    }

    try {
        const usersRaw = localStorage.getItem('users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        const foundUser = users.find((user: any) => user.email === email && user.password === password);

        if (foundUser) {
            // Set session flags in localStorage
            localStorage.setItem('isAuthenticated', 'true');
            // Store only the email as the identifier for the current user
            localStorage.setItem('currentUser', foundUser.email);

            setSuccessMessage('Đăng nhập thành công!');
            setTimeout(() => {
                // App.tsx will handle loading the correct data and navigating
                onLoginSuccess();
            }, 1000);
        } else {
            setError('Email hoặc mật khẩu không đúng.');
            setIsSubmitting(false);
        }

    } catch (err) {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        console.error(err);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <AppLogo />
          <h1 className="text-2xl font-bold text-gray-800 mt-4 text-center">
            7–14–30 Thử thách Thu Chi
          </h1>
          <p className="text-gray-500 mt-1">Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
              placeholder="nhapemail@gmail.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="font-medium text-green-600 hover:text-green-500 hover:underline focus:outline-none"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertIcon />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              <CheckCircleIcon />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isSubmitting && !successMessage ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={onGoogleLoginClick}
            type="button"
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <GoogleIcon />
            Đăng nhập bằng Google
          </button>
        </div>

        <p className="mt-8 text-center text-md text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-green-600 hover:text-green-500 hover:underline focus:outline-none"
          >
            Đăng ký tài khoản
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
