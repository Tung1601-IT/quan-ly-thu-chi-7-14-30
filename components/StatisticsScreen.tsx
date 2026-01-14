import React, { useMemo } from 'react';
import { Transaction } from '../App';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'https://esm.sh/chart.js';
import { Pie, Bar } from 'https://esm.sh/react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);


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

const CHART_COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#9CA3AF', '#A78BFA', '#F472B6'];

interface StatisticsScreenProps {
    transactions: Transaction[];
    totalExpense: number;
    onBack: () => void;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ transactions, totalExpense, onBack }) => {
    
    const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

    const expenseByCategory = useMemo(() => {
        if (totalExpense === 0) return [];
        const categoryMap: { [key: string]: number } = {};
        
        expenseTransactions.forEach(t => {
            categoryMap[t.source] = (categoryMap[t.source] || 0) + t.amount;
        });

        return Object.entries(categoryMap)
            .map(([name, amount], index) => ({
                name,
                amount,
                percentage: ((amount / totalExpense) * 100).toFixed(0),
                color: CHART_COLORS[index % CHART_COLORS.length],
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenseTransactions, totalExpense]);

    const expenseByDay = useMemo(() => {
        const dailyMap: { [key: string]: number } = {};
        expenseTransactions.forEach(t => {
            dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
        });

        return Object.entries(dailyMap)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [expenseTransactions]);

    const pieChartData = {
        labels: expenseByCategory.map(c => c.name),
        datasets: [{
            data: expenseByCategory.map(c => c.amount),
            backgroundColor: expenseByCategory.map(c => c.color),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };
    
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // We use a custom legend
            },
        },
    };

    const barChartData = {
        labels: expenseByDay.map(d => new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })),
        datasets: [{
            label: 'Chi tiêu',
            data: expenseByDay.map(d => d.amount),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
        }],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                     callback: function(value: any) {
                        if (value >= 1000) {
                            return (value / 1000) + 'k';
                        }
                        return value;
                    }
                }
            },
        },
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-md mx-auto relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-full relative">
                    <BackArrowIcon onClick={onBack} />
                    <header className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Thống kê</h1>
                    </header>

                    <main>
                        {expenseTransactions.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Chưa có dữ liệu chi tiêu để thống kê.</p>
                            </div>
                        ) : (
                            <>
                                {/* Total Expense */}
                                <div className="bg-red-50 p-4 rounded-xl text-center mb-6">
                                    <p className="text-sm font-medium text-red-700">Tổng chi tiêu</p>
                                    <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                                </div>
                                
                                {/* Expenses by Category */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-700 mb-3">Chi tiêu theo danh mục</h2>
                                    <div className="p-4 bg-gray-100 rounded-lg">
                                        <div className="w-48 h-48 mx-auto mb-4">
                                            <Pie data={pieChartData} options={pieChartOptions} />
                                        </div>
                                        <ul className="space-y-2">
                                            {expenseByCategory.map(category => (
                                                 <li key={category.name} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <span className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: category.color}}></span>
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
                                        <div className="w-full h-48 rounded-lg">
                                             <Bar data={barChartData} options={barChartOptions} />
                                        </div>
                                     </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StatisticsScreen;
