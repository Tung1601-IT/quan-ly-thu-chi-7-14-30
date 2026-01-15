

import React from 'react';

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
);

const FeedbackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

interface JarWithSpent {
    name: string;
    limit: number;
    spent: number;
}

interface DashboardScreenProps {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    currentDay: number;
    totalDays: number;
    jars: JarWithSpent[];
    onAddIncomeClick: () => void;
    onAddExpenseClick: () => void;
    onViewTransactionsClick: () => void;
    onViewStatisticsClick: () => void;
    onFeedbackClick: () => void;
    onLogout: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatCurrencyShort = (value: number) => {
     return new Intl.NumberFormat('vi-VN').format(value);
}

const JarProgressBar: React.FC<{ jar: JarWithSpent }> = ({ jar }) => {
    const { name, spent, limit } = jar;
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

    const getProgressBarColor = () => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <span className="text-sm font-semibold text-gray-600">
                    {formatCurrencyShort(spent)} / {formatCurrencyShort(limit)} ₫
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor()}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({
    balance,
    totalIncome,
    totalExpense,
    currentDay,
    totalDays,
    jars,
    onAddIncomeClick,
    onAddExpenseClick,
    onViewTransactionsClick,
    onViewStatisticsClick,
    onFeedbackClick,
    onLogout,
}) => {
    const progress = Math.min((currentDay / totalDays) * 100, 100);
    const isAddExpenseDisabled = balance <= 0;
    const validJars = jars.filter(jar => jar.limit > 0);

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-md mx-auto relative">
                <header className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                        <p className="text-gray-500">Chào mừng bạn!</p>
                    </div>
                    <button onClick={onLogout} className="text-sm font-medium text-gray-600 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        Đăng xuất
                    </button>
                </header>

                <main>
                    {/* Balance Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 text-center">
                        <p className="text-sm font-medium text-gray-500">Số dư hiện tại</p>
                        <p className={`text-4xl font-bold mt-1 ${balance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {formatCurrency(balance)}
                        </p>
                        <div className="flex justify-around mt-4 text-sm">
                            <div>
                                <p className="text-gray-500">Tổng thu</p>
                                <p className="font-bold text-green-500">{formatCurrency(totalIncome)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Tổng chi</p>
                                <p className="font-bold text-red-500">{formatCurrency(totalExpense)}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Challenge Progress */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold text-gray-800">Tiến độ thử thách</h2>
                            <p className="font-bold text-green-600">{`Ngày ${currentDay}/${totalDays}`}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Jars Progress */}
                    {validJars.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                            <h2 className="font-bold text-gray-800 mb-4">Ngân sách theo danh mục</h2>
                            <div className="space-y-4">
                                {validJars.map(jar => (
                                    <JarProgressBar key={jar.name} jar={jar} />
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button onClick={onAddIncomeClick} className="flex items-center justify-center bg-blue-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-600 transition-transform transform hover:-translate-y-1">
                            <PlusIcon /> Thêm thu
                        </button>
                        <button 
                          onClick={onAddExpenseClick} 
                          className={`flex items-center justify-center bg-red-500 text-white font-bold py-4 rounded-xl shadow-md transition-all
                            ${isAddExpenseDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-red-600 transform hover:-translate-y-1'
                            }`}
                        >
                            <PlusIcon /> Thêm chi
                        </button>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg space-y-2">
                         <button onClick={onViewTransactionsClick} className="w-full flex items-center text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <EyeIcon /> Xem giao dịch
                         </button>
                         <button onClick={onViewStatisticsClick} className="w-full flex items-center text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                             <ChartBarIcon /> Thống kê
                         </button>
                         <button onClick={onFeedbackClick} className="w-full flex items-center text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <FeedbackIcon /> Gửi phản hồi
                         </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardScreen;
