import React, { useState, useMemo, useEffect } from 'react';
import ChallengeSelectScreen from './components/ChallengeSelectScreen';
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import DashboardScreen from './components/DashboardScreen';
import AddIncomeScreen from './components/AddIncomeScreen';
import AddExpenseScreen from './components/AddExpenseScreen';
import TransactionListScreen from './components/TransactionListScreen';
import StatisticsScreen from './components/StatisticsScreen';
import CompletionScreen from './components/CompletionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import GoogleLoginScreen from './components/GoogleLoginScreen';

// Định nghĩa kiểu dữ liệu cho một giao dịch
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  source: string; // For income, this is source; for expense, this is category
  date: string;
  notes: string;
};


const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'challengeSelect' | 'setup' | 'dashboard' | 'addIncome' | 'addExpense' | 'transactionList' | 'statistics' | 'completion' | 'feedback'>('login');
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [challengeStartDate, setChallengeStartDate] = useState<string | null>(null);

  useEffect(() => {
    if (currentScreen === 'dashboard' && selectedChallenge && challengeStartDate) {
        const totalDays = parseInt(selectedChallenge.split(' ')[0], 10);
        const start = new Date(challengeStartDate);
        const today = new Date();
        
        const startOfStartDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const diffTime = startOfToday.getTime() - startOfStartDay.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const currentDay = diffDays + 1;

        if (currentDay > totalDays) {
            setCurrentScreen('completion');
        }
    }
  }, [currentScreen, challengeStartDate, selectedChallenge]);

  const handleGoogleLogin = () => {
    setShowGoogleLogin(true);
  };

  const handleGoogleLoginSuccess = () => {
      setShowGoogleLogin(false);
      setCurrentScreen('challengeSelect');
  };

  const handleGoogleLoginCancel = () => {
      setShowGoogleLogin(false);
  };

  const handleChallengeSelect = (duration: string) => {
    setSelectedChallenge(duration);
    setCurrentScreen('setup');
  };
  
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSetupComplete = (income: string, budget: string) => {
    const initialIncomeTransaction: Transaction = {
      id: `income-${Date.now()}`,
      type: 'income',
      amount: parseCurrency(income),
      source: 'Thu nhập ban đầu',
      date: new Date().toISOString().split('T')[0],
      notes: 'Khoản thu nhập đầu tiên khi bắt đầu thử thách'
    };
    
    setChallengeStartDate(new Date().toISOString());
    setTransactions([initialIncomeTransaction]);
    setCurrentScreen('dashboard');
  };

  const handleAddIncome = (income: { amount: string; source: string; date: string; notes: string }) => {
    const newIncome: Transaction = {
      id: `income-${Date.now()}`,
      type: 'income',
      amount: parseCurrency(income.amount),
      source: income.source,
      date: income.date,
      notes: income.notes,
    };
    setTransactions(prev => [newIncome, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleAddExpense = (expense: { amount: string; category: string; date: string; notes: string }) => {
    const newExpense: Transaction = {
      id: `expense-${Date.now()}`,
      type: 'expense',
      amount: parseCurrency(expense.amount),
      source: expense.category, // Using 'source' field for category
      date: expense.date,
      notes: expense.notes,
    };
    setTransactions(prev => [newExpense, ...prev]);
    setCurrentScreen('dashboard');
  };
  
  const handleStartNewChallenge = () => {
    setTransactions([]);
    setSelectedChallenge(null);
    setChallengeStartDate(null);
    setCurrentScreen('challengeSelect');
  };

  const handleFeedbackSubmit = () => {
    alert('Cảm ơn bạn đã gửi phản hồi!');
    setCurrentScreen('dashboard');
  };


  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  const renderCurrentScreen = () => {
    if (currentScreen === 'addIncome') {
      return <AddIncomeScreen 
                onBack={() => setCurrentScreen('dashboard')}
                onAddIncome={handleAddIncome}
              />;
    }
    
    if (currentScreen === 'addExpense') {
      return <AddExpenseScreen 
                onBack={() => setCurrentScreen('dashboard')}
                onAddExpense={handleAddExpense}
              />;
    }

    if (currentScreen === 'transactionList') {
      return <TransactionListScreen 
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onBack={() => setCurrentScreen('dashboard')}
             />;
    }

    if (currentScreen === 'statistics') {
      return <StatisticsScreen
                transactions={transactions}
                totalExpense={totalExpense}
                onBack={() => setCurrentScreen('dashboard')}
             />;
    }
    
    if (currentScreen === 'completion') {
      return <CompletionScreen 
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              savedAmount={balance}
              challengeDuration={selectedChallenge || ''}
              onStartNewChallenge={handleStartNewChallenge}
              onGoToFeedback={() => setCurrentScreen('feedback')}
             />;
    }

    if (currentScreen === 'feedback') {
      return <FeedbackScreen 
               onSubmit={handleFeedbackSubmit}
               onBack={() => setCurrentScreen('dashboard')}
             />;
    }

    if (currentScreen === 'dashboard') {
      const totalDays = selectedChallenge ? parseInt(selectedChallenge.split(' ')[0], 10) : 7;
      
      const calculateCurrentDay = () => {
          if (!challengeStartDate) return 1;
          const start = new Date(challengeStartDate);
          const today = new Date();
          
          const startOfStartDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

          const diffTime = startOfToday.getTime() - startOfStartDay.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          return diffDays + 1;
      };
      const currentDay = calculateCurrentDay();
      
      return <DashboardScreen
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          currentDay={currentDay}
          totalDays={totalDays}
          onAddIncomeClick={() => setCurrentScreen('addIncome')}
          onAddExpenseClick={() => setCurrentScreen('addExpense')}
          onViewTransactionsClick={() => setCurrentScreen('transactionList')}
          onViewStatisticsClick={() => setCurrentScreen('statistics')}
          onFeedbackClick={() => setCurrentScreen('feedback')}
      />;
    }

    if (currentScreen === 'setup') {
      return <SetupScreen 
                challengeDuration={selectedChallenge || ''} 
                onBack={() => setCurrentScreen('challengeSelect')}
                onStart={handleSetupComplete}
              />;
    }

    if (currentScreen === 'challengeSelect') {
      return <ChallengeSelectScreen 
                onBack={() => setCurrentScreen('login')} 
                onChallengeSelect={handleChallengeSelect}
              />;
    }
    
    return <LoginScreen onLoginSuccess={() => setCurrentScreen('challengeSelect')} onGoogleLoginClick={handleGoogleLogin} />;
  }
  
  return (
    <>
      {renderCurrentScreen()}
      {showGoogleLogin && <GoogleLoginScreen onContinue={handleGoogleLoginSuccess} onCancel={handleGoogleLoginCancel} />}
    </>
  );
};


export default App;