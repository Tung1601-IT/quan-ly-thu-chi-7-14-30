
import React, { useState, useMemo, useEffect } from 'react';
import ChallengeSelectScreen from './components/ChallengeSelectScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import DashboardScreen from './components/DashboardScreen';
import AddIncomeScreen from './components/AddIncomeScreen';
import AddExpenseScreen from './components/AddExpenseScreen';
import TransactionListScreen from './components/TransactionListScreen';
import StatisticsScreen from './components/StatisticsScreen';
import CompletionScreen from './components/CompletionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import GoogleLoginScreen from './components/GoogleLoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SetupChallengeScreen, { Jar } from './components/SetupChallengeScreen';

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
    totalBudget?: number;
    jars?: Jar[];
}

const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
};

// Helper function to get user-specific data key
const getUserDataKey = (email: string): string => `userData_${email}`;

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg flex items-center animate-slide-in" role="alert">
        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.852-1.21 3.488 0l6.112 11.69c.636 1.21-.472 2.711-1.744 2.711H3.89c-1.272 0-2.38-1.501-1.744-2.711l6.11-11.69zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm2 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path></svg>
        <p className="font-bold">{message}</p>
        <style>{`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
        `}</style>
    </div>
);


const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'forgotPassword' | 'challengeSelect' | 'setupChallenge' | 'dashboard' | 'addIncome' | 'addExpense' | 'transactionList' | 'statistics' | 'completion' | 'feedback'>('login');
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // State for the currently logged-in user's data
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [challengeStartDate, setChallengeStartDate] = useState<string | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [jars, setJars] = useState<Jar[]>([]);

  // Effect to auto-hide toast message
  useEffect(() => {
    if (toastMessage) {
        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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
                : { transactions: [], selectedChallenge: null, challengeStartDate: null, totalBudget: 0, jars: [] };

            setTransactions(savedUserData.transactions);
            setSelectedChallenge(savedUserData.selectedChallenge);
            setChallengeStartDate(savedUserData.challengeStartDate);
            setTotalBudget(savedUserData.totalBudget || 0);
            setJars(savedUserData.jars || []);
            
            // Refined navigation logic
            if (savedUserData.selectedChallenge && (savedUserData.totalBudget || 0) > 0) {
                // Challenge selected AND setup is complete -> Dashboard
                setCurrentScreen('dashboard');
            } else if (savedUserData.selectedChallenge) {
                // Challenge selected BUT setup is incomplete -> Setup Challenge Screen
                setCurrentScreen('setupChallenge');
            } else {
                // No challenge selected -> Challenge Select Screen
                setCurrentScreen('challengeSelect');
            }
        }
        // If not authenticated, the screen remains 'login' by default
    } catch (error: any) {
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
                challengeStartDate,
                totalBudget,
                jars,
            };
            localStorage.setItem(userDataKey, JSON.stringify(dataToSave));
        }
    } catch (error: any) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [transactions, selectedChallenge, challengeStartDate, totalBudget, jars, isLoading]);


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
        : { transactions: [], selectedChallenge: null, challengeStartDate: null, totalBudget: 0, jars: [] };
      
      // Update state with this user's data
      setTransactions(userData.transactions);
      setSelectedChallenge(userData.selectedChallenge);
      setChallengeStartDate(userData.challengeStartDate);
      setTotalBudget(userData.totalBudget || 0);
      setJars(userData.jars || []);
      
      // Refined navigation logic
      if (userData.selectedChallenge && (userData.totalBudget || 0) > 0) {
        // If a challenge is selected AND setup is complete, go to dashboard.
        setCurrentScreen('dashboard');
      } else if (userData.selectedChallenge) {
        // If a challenge is selected but setup is NOT complete, go to setup screen.
        setCurrentScreen('setupChallenge');
      } else {
        // If no challenge is selected, go to challenge selection.
        setCurrentScreen('challengeSelect');
      }
  };


  const handleGoogleLogin = () => {
    setShowGoogleLogin(true);
  };

  const handleGoogleLoginSuccess = () => {
      setShowGoogleLogin(false);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', 'nguyenvana@gmail.com');
      handleLoginSuccess();
  };

  const handleGoogleLoginCancel = () => {
      setShowGoogleLogin(false);
  };

  const handleChallengeSelect = (duration: string) => {
    const challengeValue = duration.split(' ')[0];
    const startDate = new Date().toISOString();
    
    setSelectedChallenge(challengeValue);
    setChallengeStartDate(startDate);
    
    setCurrentScreen('setupChallenge');
  };
  
  const handleSetupChallenge = (data: { days: number; totalBudget: number; jars: Jar[] }) => {
    setTotalBudget(data.totalBudget);
    setJars(data.jars);

    const initialIncomeTransaction: Transaction = {
      id: `income-${Date.now()}`,
      type: 'income',
      amount: data.totalBudget,
      source: 'Ngân sách ban đầu',
      date: new Date().toISOString().split('T')[0],
      notes: `Ngân sách cho thử thách ${data.days} ngày`
    };
    
    setTransactions([initialIncomeTransaction]);
    setCurrentScreen('dashboard');
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
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

  const handleAddExpense = (expense: { amount: string; category: string; date: string; notes: string }) => {
    const newExpenseAmount = parseCurrency(expense.amount);

    // Calculate current spending in the target jar
    const targetJar = jars.find(jar => jar.name === expense.category);
    const currentSpentInJar = transactions
        .filter(t => t.type === 'expense' && t.source === expense.category)
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Define failure conditions
    const exceedsBalance = newExpenseAmount > balance;
    const exceedsTotalBudget = (totalExpense + newExpenseAmount) > totalBudget;
    const exceedsJarLimit = targetJar ? (currentSpentInJar + newExpenseAmount > targetJar.limit) : false;

    // Check if any failure condition is met
    if (exceedsBalance || exceedsTotalBudget || exceedsJarLimit) {
        setToastMessage("Khoản chi vượt quá giới hạn cho phép. Không thể lưu.");
        return; // Stop the function
    }

    // If all checks pass, add the expense
    const newExpense: Transaction = {
      id: `expense-${Date.now()}`,
      type: 'expense',
      amount: newExpenseAmount,
      source: expense.category,
      date: expense.date,
      notes: expense.notes,
    };
    setTransactions(prev => [newExpense, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleAddExpenseClick = () => {
    if (balance <= 0) {
        setToastMessage("Số dư hiện tại bằng 0. Bạn không thể chi tiêu thêm.");
    } else {
        setCurrentScreen('addExpense');
    }
  };
  
  const handleStartNewChallenge = () => {
    setSelectedChallenge(null);
    setChallengeStartDate(null);
    setTotalBudget(0);
    setJars([]);
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
    setTotalBudget(0);
    setJars([]);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');

    setCurrentScreen('login');
  };

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
          onAddExpenseClick={handleAddExpenseClick}
          onViewTransactionsClick={() => setCurrentScreen('transactionList')}
          onViewStatisticsClick={() => setCurrentScreen('statistics')}
          onFeedbackClick={() => setCurrentScreen('feedback')}
          onLogout={handleLogout}
      />;
    }
    if (currentScreen === 'setupChallenge') {
        return <SetupChallengeScreen 
            challengeDuration={(selectedChallenge || '') + ' NGÀY'}
            onBack={() => setCurrentScreen('challengeSelect')}
            onSetupChallenge={handleSetupChallenge}
        />
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
      {toastMessage && <Toast message={toastMessage} />}
      {renderCurrentScreen()}
      {showGoogleLogin && <GoogleLoginScreen onContinue={handleGoogleLoginSuccess} onCancel={handleGoogleLoginCancel} />}
    </>
  );
};

export default App;
