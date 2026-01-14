import React from 'react';

interface CompletionScreenProps {
    totalIncome: number;
    totalExpense: number;
    savedAmount: number;
    challengeDuration: string;
    onStartNewChallenge: () => void;
    onGoToFeedback: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const PartyPopperIcon: React.FC = () => (
    <span role="img" aria-label="party popper" className="text-5xl">🎉</span>
);

const CompletionScreen: React.FC<CompletionScreenProps> = ({
    totalIncome,
    totalExpense,
    savedAmount,
    challengeDuration,
    onStartNewChallenge,
    onGoToFeedback,
}) => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
                <header className="mb-6">
                    <PartyPopperIcon />
                    <h1 className="text-3xl font-bold text-gray-800 mt-4">Hoàn thành thử thách!</h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Chúc mừng bạn đã hoàn thành thử thách <span className="font-bold text-green-600">{challengeDuration}</span>.
                    </p>
                </header>

                <main>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Tổng thu:</p>
                            <p className="font-bold text-green-600 text-xl">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Tổng chi:</p>
                            <p className="font-bold text-red-600 text-xl">{formatCurrency(totalExpense)}</p>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-gray-800 text-lg">Bạn đã tiết kiệm:</p>
                            <p className={`font-bold text-2xl ${savedAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(savedAmount)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={onStartNewChallenge}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                        >
                            Bắt đầu thử thách mới
                        </button>
                        <button
                            onClick={onGoToFeedback}
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
                        >
                            Gửi phản hồi
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompletionScreen;