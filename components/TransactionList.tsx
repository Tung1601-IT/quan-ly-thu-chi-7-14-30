import React, { useState, useMemo } from 'react';
import { Transaction } from '../App';

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const formatCurrency = (value: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+ ' : '- ';
    const formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    return prefix + formattedValue;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
};

interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const filteredTransactions = useMemo(() => {
        if (filter === 'all') {
            return transactions;
        }
        return transactions.filter(t => t.type === filter);
    }, [transactions, filter]);

    const getFilterButtonClass = (buttonFilter: typeof filter) => {
        const baseClass = "px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200";
        if (filter === buttonFilter) {
            return `${baseClass} bg-green-500 text-white`;
        }
        return `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Giao dịch</h2>
            
            <div className="flex space-x-2 mb-4 border-b pb-4">
                <button onClick={() => setFilter('all')} className={getFilterButtonClass('all')}>Tất cả</button>
                <button onClick={() => setFilter('income')} className={getFilterButtonClass('income')}>Thu</button>
                <button onClick={() => setFilter('expense')} className={getFilterButtonClass('expense')}>Chi</button>
            </div>
            
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(transaction => (
                        <li key={transaction.id} className="py-3 flex items-center justify-between group">
                            <div className="flex items-center">
                                <div className="text-center w-12 mr-4">
                                    <p className="font-bold text-gray-800">{formatDate(transaction.date)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{transaction.source}</p>
                                    <p className="text-sm text-gray-500">{transaction.notes}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className={`font-bold text-right w-32 ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(transaction.amount, transaction.type)}
                                </p>
                                {transaction.source !== 'Thu nhập ban đầu' ? (
                                    <button 
                                      onClick={() => onDeleteTransaction(transaction.id)} 
                                      className="ml-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                      aria-label={`Xóa giao dịch ${transaction.source}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                ) : (
                                    // Placeholder to keep alignment consistent
                                    <div className="w-5 h-5 ml-4" />
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="py-4 text-center text-gray-500">
                        Không có giao dịch nào.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default TransactionList;