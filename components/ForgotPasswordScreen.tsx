import React, { useState } from 'react';

// Icons for input fields
const EmailIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
);

const LockIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);

const AlertIcon: React.FC = () => (
     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.852-1.21 3.488 0l6.112 11.69c.636 1.21-.472 2.711-1.744 2.711H3.89c-1.272 0-2.38-1.501-1.744-2.711l6.11-11.69zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm2 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path></svg>
);

const CheckCircleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);


interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!email.trim()) {
      setError('Email không được để trống.');
      setIsSubmitting(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      setIsSubmitting(false);
      return;
    }

    try {
      const usersRaw = localStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const userIndex = users.findIndex((user: any) => user.email === email);

      if (userIndex === -1) {
        setError('Email này chưa được đăng ký.');
        setIsSubmitting(false);
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      setSuccessMessage('Đặt lại mật khẩu thành công!');
      
      setTimeout(() => {
        onBackToLogin();
      }, 1500);

    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h1>
          <p className="text-gray-500 mt-2">Nhập email và mật khẩu mới của bạn.</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email đã đăng ký
            </label>
            <div className="relative">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon />
                 </span>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  placeholder="nhapemail@gmail.com"
                />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                </span>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  placeholder="••••••••"
                />
            </div>
          </div>
          
           <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                </span>
                <input
                  id="confirm-new-password"
                  name="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  placeholder="••••••••"
                />
            </div>
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
              {isSubmitting && !successMessage ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-md text-gray-600">
          Nhớ mật khẩu rồi?{' '}
          <button
            onClick={onBackToLogin}
            className="font-bold text-green-600 hover:text-green-500 hover:underline focus:outline-none"
          >
            Quay lại đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
