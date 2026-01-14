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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const FeedbackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);


interface DashboardScreenProps {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    currentDay: number;
    totalDays: number;
    onAddIncomeClick: () => void;
    onAddExpenseClick: () => void;
    onViewTransactionsClick: () => void;
    onViewStatisticsClick: () => void;
    onFeedbackClick: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({
    balance,
    totalIncome,
    totalExpense,
    currentDay,
    totalDays,
    onAddIncomeClick,
    onAddExpenseClick,
    onViewTransactionsClick,
    onViewStatisticsClick,
    onFeedbackClick,
}) => {
    const progressPercentage = (currentDay / totalDays) * 100;

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-md mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Bảng điều khiển</h1>
                </header>

                <main>
                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm">Số dư hiện tại</p>
                            <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(balance)}</p>
                        </div>
                        <div className="flex justify-between text-center border-t pt-4">
                            <div>
                                <p className="text-gray-500 text-sm">Tổng thu</p>
                                <p className="text-lg font-semibold text-green-500">{formatCurrency(totalIncome)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Tổng chi</p>
                                <p className="text-lg font-semibold text-red-500">{formatCurrency(totalExpense)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Challenge Progress */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-gray-700">Tiến độ thử thách</p>
                            <p className="text-sm font-semibold text-gray-600">Ngày {currentDay} / {totalDays}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
                                aria-valuenow={progressPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                role="progressbar"
                                aria-label={`Tiến độ thử thách: ${currentDay} trên ${totalDays} ngày`}
                            ></div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onAddIncomeClick}
                                className="flex items-center justify-center w-full p-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
                                <PlusIcon />
                                Thêm thu
                            </button>
                            <button 
                                onClick={onAddExpenseClick}
                                className="flex items-center justify-center w-full p-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300">
                                <PlusIcon />
                                Thêm chi
                            </button>
                        </div>
                         <button
                            onClick={onViewTransactionsClick}
                            className="w-full flex items-center justify-center p-4 border border-gray-300 rounded-xl shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300">
                            <EyeIcon />
                            Xem giao dịch
                        </button>
                         <button
                            onClick={onViewStatisticsClick}
                            className="w-full flex items-center justify-center p-4 border border-gray-300 rounded-xl shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300">
                            <ChartBarIcon />
                            Thống kê
                        </button>
                         <button
                            onClick={onFeedbackClick}
                            className="w-full flex items-center justify-center p-4 border border-gray-300 rounded-xl shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300">
                            <FeedbackIcon />
                            Gửi phản hồi
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardScreen;