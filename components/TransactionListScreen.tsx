import React from 'react';
import { Transaction } from '../App';
import TransactionList from './TransactionList';

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

interface TransactionListScreenProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
    onBack: () => void;
}

const TransactionListScreen: React.FC<TransactionListScreenProps> = ({ transactions, onDeleteTransaction, onBack }) => {
    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-md mx-auto relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-full relative">
                    <BackArrowIcon onClick={onBack} />
                    <header className="mb-4 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Giao dịch</h1>
                    </header>
                    <TransactionList 
                        transactions={transactions} 
                        onDeleteTransaction={onDeleteTransaction} 
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionListScreen;
