import React, { useMemo } from 'react';
import { Transaction } from '../App';

const BackArrowIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
    aria-label="Quay lại"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Mock category colors
const categoryColors: { [key: string]: string } = {
  'Ăn uống': 'bg-blue-500',
  'Mua sắm': 'bg-purple-500',
  'Đi lại': 'bg-yellow-500',
  'Giải trí': 'bg-pink-500',
  'Khác': 'bg-gray-400',
};


interface StatisticsScreenProps {
    transactions: Transaction[];
    totalExpense: number;
    onBack: () => void;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ transactions, totalExpense, onBack }) => {
    
    const expenseByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.source] = (categoryMap[t.source] || 0) + t.amount;
            });

        return Object.entries(categoryMap)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) : 0,
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, totalExpense]);

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-md mx-auto relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-full relative">
                    <BackArrowIcon onClick={onBack} />
                    <header className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Thống kê</h1>
                    </header>

                    <main>
                        {/* Total Expense */}
                        <div className="bg-red-50 p-4 rounded-xl text-center mb-6">
                            <p className="text-sm font-medium text-red-700">Tổng chi tiêu</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                        </div>
                        
                        {/* Expenses by Category */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-700 mb-3">Chi tiêu theo danh mục</h2>
                            <div className="p-4 bg-gray-100 rounded-lg">
                                {/* Pie chart placeholder */}
                                <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Biểu đồ tròn</p>
                                </div>
                                <ul className="space-y-2">
                                    {expenseByCategory.map(category => (
                                         <li key={category.name} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className={`w-3 h-3 rounded-full mr-3 ${categoryColors[category.name] || 'bg-gray-400'}`}></span>
                                                <span className="text-gray-800">{category.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{category.percentage}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                         {/* Expenses by Day */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-700 mb-3">Chi tiêu theo ngày</h2>
                             <div className="p-4 bg-gray-100 rounded-lg">
                                {/* Bar chart placeholder */}
                                <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                                     <p className="text-gray-500 text-sm">Biểu đồ cột</p>
                                </div>
                             </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default StatisticsScreen;