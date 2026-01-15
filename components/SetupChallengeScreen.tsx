
import React, { useState, useMemo } from 'react';

// Reusable components/icons
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

const AlertIcon: React.FC = () => (
     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.852-1.21 3.488 0l6.112 11.69c.636 1.21-.472 2.711-1.744 2.711H3.89c-1.272 0-2.38-1.501-1.744-2.711l6.11-11.69zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm2 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path></svg>
);

// Type definitions
export interface Jar {
    name: string;
    limit: number;
    spent: number;
}

interface SetupChallengeScreenProps {
  challengeDuration: string; // e.g., "7 NGÀY"
  onBack: () => void;
  onSetupChallenge: (data: {
    days: number;
    totalBudget: number;
    jars: Jar[];
  }) => void;
}

// Shared categories list, same as in AddExpenseScreen
const expenseCategories = [
    'Ăn uống',
    'Đi lại',
    'Mua sắm',
    'Giải trí',
    'Khác',
];

// Initial jars based on the shared categories
const initialJars = expenseCategories.map((name, index) => ({
    id: index + 1,
    name: name,
    amount: '',
}));

// Helper functions for currency formatting
const formatCurrencyForDisplay = (value: string) => {
    if (!value) return '';
    const numberValue = parseInt(value, 10);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('vi-VN').format(numberValue);
};

const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
};

const SetupChallengeScreen: React.FC<SetupChallengeScreenProps> = ({ challengeDuration, onBack, onSetupChallenge }) => {
  const [totalBudget, setTotalBudget] = useState('');
  const [jars, setJars] = useState(initialJars);
  const [error, setError] = useState<string | null>(null);

  const parsedTotalBudget = useMemo(() => parseCurrency(totalBudget), [totalBudget]);

  const totalAllocated = useMemo(() => {
    return jars.reduce((sum, jar) => sum + parseCurrency(jar.amount), 0);
  }, [jars]);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setter(rawValue);
    setError(null); // Clear error on input change
  };

  const handleJarAmountChange = (id: number, value: string) => {
    const rawValue = value.replace(/[^0-9]/g, '');
    setJars(jars.map(jar => jar.id === id ? { ...jar, amount: rawValue } : jar));
    setError(null); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (parsedTotalBudget <= 0) {
      setError('Vui lòng nhập tổng ngân sách hợp lệ.');
      return;
    }

    if (jars.some(jar => !jar.amount || parseCurrency(jar.amount) < 0)) {
        setError('Vui lòng nhập số tiền phân bổ cho tất cả các hũ.');
        return;
    }

    if (totalAllocated > parsedTotalBudget) {
      setError('Tổng phân bổ không được vượt quá tổng ngân sách.');
      return;
    }

    if (totalAllocated !== parsedTotalBudget) {
      setError('Tổng tiền phân bổ cho các hũ phải bằng tổng ngân sách.');
      return;
    }

    // Prepare data for callback
    const challengeData = {
        days: parseInt(challengeDuration.split(' ')[0], 10),
        totalBudget: parsedTotalBudget,
        jars: jars.map(jar => ({
            name: jar.name,
            limit: parseCurrency(jar.amount),
            spent: 0
        }))
    };
    
    onSetupChallenge(challengeData);
  };
  
  const isAllocationCorrect = totalAllocated === parsedTotalBudget && parsedTotalBudget > 0;
  const isButtonDisabled = !isAllocationCorrect;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md relative">
        <BackArrowIcon onClick={onBack} />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Thiết lập thử thách</h1>
          <p className="text-gray-500 mt-1">
            Thời gian: <span className="font-bold text-green-600">{challengeDuration}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Budget Input */}
          <div>
            <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Bạn muốn chi tiêu tối đa bao nhiêu?
            </label>
            <div className="relative">
              <input
                id="totalBudget"
                name="totalBudget"
                type="text"
                inputMode="numeric"
                required
                value={formatCurrencyForDisplay(totalBudget)}
                onChange={handleInputChange(setTotalBudget)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                placeholder="Ví dụ: 3.500.000"
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">₫</span>
            </div>
          </div>

          {/* Jars Allocation */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phân bổ ngân sách
              </label>
              <div className="space-y-3">
                {jars.map(jar => (
                    <div key={jar.id} className="flex items-center space-x-3">
                         <span className="w-24 text-gray-600">{jar.name}</span>
                         <div className="relative flex-1">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formatCurrencyForDisplay(jar.amount)}
                                onChange={(e) => handleJarAmountChange(jar.id, e.target.value)}
                                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                                placeholder="0"
                            />
                            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">₫</span>
                         </div>
                    </div>
                ))}
              </div>
          </div>
          
          {/* Allocation Summary */}
          <div className="pt-2 border-t">
             <div className="flex justify-between items-center text-md font-semibold">
                <span>Đã phân bổ:</span>
                <span className={`flex items-center ${isAllocationCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {new Intl.NumberFormat('vi-VN').format(totalAllocated)} / {new Intl.NumberFormat('vi-VN').format(parsedTotalBudget)} ₫
                    {isAllocationCorrect && (
                         <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    )}
                </span>
             </div>
          </div>

          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertIcon />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Bắt đầu thử thách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupChallengeScreen;
