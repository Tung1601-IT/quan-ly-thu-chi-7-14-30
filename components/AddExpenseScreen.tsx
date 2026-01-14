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

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface AddExpenseScreenProps {
    onBack: () => void;
    onAddExpense: (expense: { amount: string; category: string; date: string; notes: string }) => void;
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ onBack, onAddExpense }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Ăn uống');
    const [date, setDate] = useState(getTodayDateString());
    const [notes, setNotes] = useState('');

    const formatCurrencyForDisplay = (value: string) => {
        if (!value) return '';
        const numberValue = parseInt(value, 10);
        if (isNaN(numberValue)) return '';
        return new Intl.NumberFormat('vi-VN').format(numberValue);
    };
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setAmount(rawValue);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) {
            alert('Vui lòng nhập số tiền chi.');
            return;
        }
        onAddExpense({ amount, category, date, notes });
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md relative">
                <BackArrowIcon onClick={onBack} />
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Thêm khoản chi</h1>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền chi
                        </label>
                        <div className="relative">
                            <input
                                id="amount"
                                name="amount"
                                type="text"
                                inputMode="numeric"
                                required
                                value={formatCurrencyForDisplay(amount)}
                                onChange={handleAmountChange}
                                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                                placeholder="Ví dụ: 150.000"
                            />
                            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">₫</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục chi tiêu
                        </label>
                         <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out bg-white appearance-none"
                        >
                            <option>Ăn uống</option>
                            <option>Đi lại</option>
                            <option>Mua sắm</option>
                            <option>Giải trí</option>
                            <option>Khác</option>
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày
                        </label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                        />
                    </div>

                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                            placeholder="Ví dụ: Ăn trưa"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                        >
                            Lưu khoản chi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseScreen;