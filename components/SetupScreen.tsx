import React, { useState } from 'react';

const BackArrowIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
    aria-label="Quay lại"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

interface SetupScreenProps {
  challengeDuration: string;
  onBack: () => void;
  onStart: (income: string, budget: string) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ challengeDuration, onBack, onStart }) => {
  const [income, setIncome] = useState(''); // Raw number string
  const [budget, setBudget] = useState(''); // Raw number string

  const formatCurrencyForDisplay = (value: string) => {
    if (!value) return '';
    const numberValue = parseInt(value, 10);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('vi-VN').format(numberValue);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setter(rawValue);
  };

  const handleStartChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!income) {
      alert('Vui lòng nhập tổng thu nhập của bạn.');
      return;
    }
    onStart(income, budget);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md relative">
        <BackArrowIcon onClick={onBack} />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Thiết lập ban đầu</h1>
          <p className="text-gray-500 mt-1">Cho thử thách <span className="font-bold text-green-600">{challengeDuration}</span></p>
        </div>

        <form onSubmit={handleStartChallenge} className="space-y-6">
          <div>
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tổng thu nhập
            </label>
            <div className="relative">
              <input
                id="income"
                name="income"
                type="text"
                inputMode="numeric"
                required
                value={formatCurrencyForDisplay(income)}
                onChange={handleInputChange(setIncome)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                placeholder="Ví dụ: 5.000.000"
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">₫</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngân sách chi tiêu (tùy chọn)
            </label>
             <div className="relative">
              <input
                id="budget"
                name="budget"
                type="text"
                inputMode="numeric"
                value={formatCurrencyForDisplay(budget)}
                onChange={handleInputChange(setBudget)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                placeholder="Ví dụ: 3.000.000"
              />
               <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">₫</span>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              Bắt đầu thử thách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;