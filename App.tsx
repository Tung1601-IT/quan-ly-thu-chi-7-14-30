import React, { useState, useMemo, useEffect } from 'react';
import ChallengeSelectScreen from './components/ChallengeSelectScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import SetupScreen from './components/SetupScreen';
import DashboardScreen from './components/DashboardScreen';
import AddIncomeScreen from './components/AddIncomeScreen';
import AddExpenseScreen from './components/AddExpenseScreen';
import TransactionListScreen from './components/TransactionListScreen';
import StatisticsScreen from './components/StatisticsScreen';
import CompletionScreen from './components/CompletionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import GoogleLoginScreen from './components/GoogleLoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

// Định nghĩa kiểu dữ liệu cho một giao dịch
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  source: string; // For income, this is source; for expense, this is category
  date: string;
  notes: string;
};

// Kiểu dữ liệu cho state của từng user
type UserData = {
    transactions: Transaction[];
    selectedChallenge: string | null;
    challengeStartDate: string | null;
}

const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
};

// Helper function to get user-specific data key
const getUserDataKey = (email: string): string => `userData_${email}`;

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'forgotPassword' | 'challengeSelect' | 'setup' | 'dashboard' | 'addIncome' | 'addExpense' | 'transactionList' | 'statistics' | 'completion' | 'feedback'>('login');
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the currently logged-in user's data
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [challengeStartDate, setChallengeStartDate] = useState<string | null>(null);

  // Effect to check auth state and load user data on initial load
  useEffect(() => {
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const currentUserEmail = localStorage.getItem('currentUser');

        if (isAuthenticated && currentUserEmail) {
            // User is authenticated, load their specific data
            const userDataKey = getUserDataKey(currentUserEmail);
            const savedUserDataRaw = localStorage.getItem(userDataKey);
            const savedUserData: UserData = savedUserDataRaw 
                ? JSON.parse(savedUserDataRaw) 
                : { transactions: [], selectedChallenge: null, challengeStartDate: null };

            setTransactions(savedUserData.transactions);
            setSelectedChallenge(savedUserData.selectedChallenge);
            setChallengeStartDate(savedUserData.challengeStartDate);
            
            // Navigate based on whether a challenge has been selected
            if (savedUserData.selectedChallenge) {
                setCurrentScreen('dashboard');
            } else {
                setCurrentScreen('challengeSelect');
            }
        }
        // If not authenticated, the screen remains 'login' by default
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.clear(); // Clear storage if data is corrupted
    }
    setIsLoading(false);
  }, []);

  // Effect to save state changes to the current user's data in localStorage
  useEffect(() => {
    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const currentUserEmail = localStorage.getItem('currentUser');

        if (isAuthenticated && currentUserEmail && !isLoading) {
            const userDataKey = getUserDataKey(currentUserEmail);
            const dataToSave: UserData = {
                transactions,
                selectedChallenge,
                challengeStartDate
            };
            localStorage.setItem(userDataKey, JSON.stringify(dataToSave));
        }
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [transactions, selectedChallenge, challengeStartDate, isLoading]);


  useEffect(() => {
    if (currentScreen === 'dashboard' && selectedChallenge && challengeStartDate) {
        const totalDays = parseInt(selectedChallenge, 10);
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
  
  const handleLoginSuccess = () => {
      const currentUserEmail = localStorage.getItem('currentUser');
      if (!currentUserEmail) return;

      // Load data for the newly logged-in user
      const userDataKey = getUserDataKey(currentUserEmail);
      const savedUserDataRaw = localStorage.getItem(userDataKey);
      const userData: UserData = savedUserDataRaw
        ? JSON.parse(savedUserDataRaw)
        : { transactions: [], selectedChallenge: null, challengeStartDate: null };
      
      // Update state with this user's data
      setTransactions(userData.transactions);
      setSelectedChallenge(userData.selectedChallenge);
      setChallengeStartDate(userData.challengeStartDate);
      
      // Navigate
      if (userData.selectedChallenge) {
          setCurrentScreen('dashboard');
      } else {
          setCurrentScreen('challengeSelect');
      }
  };


  const handleGoogleLogin = () => {
    setShowGoogleLogin(true);
  };

  const handleGoogleLoginSuccess = () => {
      setShowGoogleLogin(false);
      // Mock Google login success
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', 'nguyenvana@gmail.com');
      handleLoginSuccess();
  };

  const handleGoogleLoginCancel = () => {
      setShowGoogleLogin(false);
  };

  const handleChallengeSelect = (duration: string) => {
    const challengeValue = duration.split(' ')[0]; // e.g., "7"
    const startDate = new Date().toISOString();
    
    // Update state, the useEffect will handle saving to localStorage
    setSelectedChallenge(challengeValue);
    setChallengeStartDate(startDate);
    
    // Initialize transactions if it's the first time
    if(transactions.length === 0) {
        setTransactions([]);
    }
    
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
    
    if(transactions.length === 0) {
        setTransactions([initialIncomeTransaction]);
    }

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
      source: expense.category,
      date: expense.date,
      notes: expense.notes,
    };
    setTransactions(prev => [newExpense, ...prev]);
    setCurrentScreen('dashboard');
  };
  
  const handleStartNewChallenge = () => {
    setSelectedChallenge(null);
    setChallengeStartDate(null);
    // Note: Transactions are kept for the new challenge
    setCurrentScreen('challengeSelect');
  };

  const handleFeedbackSubmit = () => {
    alert('Cảm ơn bạn đã gửi phản hồi!');
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    // Clear react state to default values
    setTransactions([]);
    setSelectedChallenge(null);
    setChallengeStartDate(null);
    
    // Remove session-related items from localStorage, but keep user data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');

    setCurrentScreen('login');
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
    if (currentScreen === 'register') {
      return <RegisterScreen onBackToLogin={() => setCurrentScreen('login')} />;
    }
    if (currentScreen === 'forgotPassword') {
        return <ForgotPasswordScreen onBackToLogin={() => setCurrentScreen('login')} />;
    }
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
              challengeDuration={(selectedChallenge || '0') + ' NGÀY'}
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
      const totalDays = selectedChallenge ? parseInt(selectedChallenge, 10) : 7;
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
          onLogout={handleLogout}
      />;
    }
    if (currentScreen === 'setup') {
      return <SetupScreen 
                challengeDuration={(selectedChallenge || '') + ' NGÀY'} 
                onBack={() => setCurrentScreen('challengeSelect')}
                onStart={handleSetupComplete}
              />;
    }
    if (currentScreen === 'challengeSelect') {
      return <ChallengeSelectScreen 
                onBack={() => { handleLogout(); }} 
                onChallengeSelect={handleChallengeSelect}
              />;
    }
    return <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onGoogleLoginClick={handleGoogleLogin} 
            onNavigateToRegister={() => setCurrentScreen('register')}
            onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
           />;
  }
  
  if (isLoading) {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Đang tải ứng dụng...</p>
        </div>
    );
  }
  
  return (
    <>
      {renderCurrentScreen()}
      {showGoogleLogin && <GoogleLoginScreen onContinue={handleGoogleLoginSuccess} onCancel={handleGoogleLoginCancel} />}
    </>
  );
};

export default App;
