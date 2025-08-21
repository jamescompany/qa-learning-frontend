import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../components/common/Header';
import TestingGuide from '../../components/qa/TestingGuide';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
}

interface Account {
  id: string;
  name: string;
  type: string;
  number: string;
  balance: number;
  currency: string;
}

const BankingDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState('checking');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [showManageBillsModal, setShowManageBillsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [selectedBiller, setSelectedBiller] = useState('');
  const [searchTransaction, setSearchTransaction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const currentLocale = i18n.language;

  // 한국어일 경우 원화로 변환
  const getLocalizedBalance = (usdAmount: number) => {
    if (currentLocale === 'ko') {
      return usdAmount * 1300; // 1 USD = 1300 KRW (예시 환율)
    }
    return usdAmount;
  };

  const accounts: Account[] = [
    { id: 'checking', name: t('banking.account.checking'), type: t('banking.account.type.checking'), number: '****1234', balance: getLocalizedBalance(5432.10), currency: currentLocale === 'ko' ? 'KRW' : 'USD' },
    { id: 'savings', name: t('banking.account.savings'), type: t('banking.account.type.savings'), number: '****5678', balance: getLocalizedBalance(12000.50), currency: currentLocale === 'ko' ? 'KRW' : 'USD' },
    { id: 'credit', name: t('banking.account.credit'), type: t('banking.account.type.credit'), number: '****9012', balance: getLocalizedBalance(-1234.75), currency: currentLocale === 'ko' ? 'KRW' : 'USD' },
    { id: 'investment', name: t('banking.account.investment'), type: t('banking.account.type.investment'), number: '****3456', balance: getLocalizedBalance(45678.90), currency: currentLocale === 'ko' ? 'KRW' : 'USD' },
  ];

  const transactions: Transaction[] = [
    { id: 'TXN001', date: '2024-01-20', description: 'Amazon Purchase', category: 'Shopping', amount: getLocalizedBalance(-89.99), type: 'debit', status: 'completed' },
    { id: 'TXN002', date: '2024-01-20', description: 'Salary Deposit', category: 'Income', amount: getLocalizedBalance(3500.00), type: 'credit', status: 'completed' },
    { id: 'TXN003', date: '2024-01-19', description: 'Uber Ride', category: 'Transport', amount: getLocalizedBalance(-23.45), type: 'debit', status: 'completed' },
    { id: 'TXN004', date: '2024-01-19', description: 'Netflix Subscription', category: 'Entertainment', amount: getLocalizedBalance(-15.99), type: 'debit', status: 'completed' },
    { id: 'TXN005', date: '2024-01-18', description: 'Grocery Store', category: 'Food', amount: getLocalizedBalance(-156.78), type: 'debit', status: 'completed' },
    { id: 'TXN006', date: '2024-01-18', description: 'ATM Withdrawal', category: 'Cash', amount: getLocalizedBalance(-200.00), type: 'debit', status: 'pending' },
    { id: 'TXN007', date: '2024-01-17', description: 'Electric Bill', category: 'Utilities', amount: getLocalizedBalance(-98.50), type: 'debit', status: 'completed' },
    { id: 'TXN008', date: '2024-01-17', description: 'Refund - Online Order', category: 'Shopping', amount: getLocalizedBalance(45.00), type: 'credit', status: 'completed' },
  ];

  const quickActions = [
    { id: 'transfer', label: t('banking.quickActions.transfer'), icon: '💸' },
    { id: 'pay-bill', label: t('banking.quickActions.payBills'), icon: '📄' },
    { id: 'deposit', label: t('banking.quickActions.mobileDeposit'), icon: '📱' },
    { id: 'send-money', label: t('banking.quickActions.sendMoney'), icon: '💰' },
    { id: 'cards', label: t('banking.quickActions.manageCards'), icon: '💳' },
    { id: 'statements', label: t('banking.quickActions.statements'), icon: '📊' },
  ];

  const [upcomingBills, setUpcomingBills] = useState([
    { id: 1, name: 'Electric Company', dueDate: '2024-01-25', amount: getLocalizedBalance(98.50), autoPay: false },
    { id: 2, name: 'Internet Provider', dueDate: '2024-01-28', amount: getLocalizedBalance(79.99), autoPay: true },
    { id: 3, name: 'Phone Bill', dueDate: '2024-02-01', amount: getLocalizedBalance(45.00), autoPay: false },
    { id: 4, name: 'Insurance', dueDate: '2024-02-05', amount: getLocalizedBalance(250.00), autoPay: true },
  ]);

  const handleTransfer = () => {
    if (!transferAmount || !transferTo) {
      toast.error(t('banking.messages.fillAllFields'));
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      toast.success(t('banking.messages.transferSuccess'));
      setShowTransferModal(false);
      setShowPinModal(false);
      setPin('');
      setTransferAmount('');
      setTransferTo('');
    } else {
      toast.error(t('banking.messages.invalidPin'));
    }
  };

  const handlePayBill = () => {
    if (!selectedBiller || !billAmount) {
      toast.error(t('banking.messages.selectBillerAmount'));
      return;
    }
    toast.success(t('banking.messages.billPaymentScheduled'));
    setShowPayBillModal(false);
    setBillAmount('');
    setSelectedBiller('');
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'transfer':
        setShowTransferModal(true);
        break;
      case 'pay-bill':
        setShowPayBillModal(true);
        break;
      case 'deposit':
        toast(t('banking.messages.openingCamera'));
        break;
      case 'send-money':
        toast(t('banking.messages.sendMoneyComingSoon'));
        break;
      case 'cards':
        toast(t('banking.messages.cardManagementComingSoon'));
        break;
      case 'statements':
        setShowStatementModal(true);
        break;
      case 'security':
        setShowSecurityModal(true);
        break;
      default:
        break;
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (searchTransaction && !txn.description.toLowerCase().includes(searchTransaction.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && txn.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.type !== 'Credit' ? acc.balance : 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Common Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      {/* Banking Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" data-testid="banking-header">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('banking.header.welcome')}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('banking.header.lastLogin')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600" data-testid="notifications-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600" data-testid="messages-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600" data-testid="settings-btn">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700" data-testid="logout-btn">
                {t('banking.header.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Testing Guide */}
        <TestingGuide
          title={t('banking.testingGuide.title')}
          description={t('banking.testingGuide.description')}
          scenarios={[
            {
              id: 'security-validation',
              title: t('banking.testingGuide.scenarios.pinSecurity.title'),
              description: t('banking.testingGuide.scenarios.pinSecurity.description'),
              steps: [
                t('banking.testingGuide.scenarios.pinSecurity.steps.1'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.2'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.3'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.4'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.5'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.6'),
                t('banking.testingGuide.scenarios.pinSecurity.steps.7')
              ],
              expectedResult: t('banking.testingGuide.scenarios.pinSecurity.expectedResult'),
              difficulty: 'hard'
            },
            {
              id: 'account-switching',
              title: t('banking.testingGuide.scenarios.accountSwitching.title'),
              description: t('banking.testingGuide.scenarios.accountSwitching.description'),
              steps: [
                t('banking.testingGuide.scenarios.accountSwitching.steps.1'),
                t('banking.testingGuide.scenarios.accountSwitching.steps.2'),
                t('banking.testingGuide.scenarios.accountSwitching.steps.3'),
                t('banking.testingGuide.scenarios.accountSwitching.steps.4'),
                t('banking.testingGuide.scenarios.accountSwitching.steps.5'),
                t('banking.testingGuide.scenarios.accountSwitching.steps.6')
              ],
              expectedResult: t('banking.testingGuide.scenarios.accountSwitching.expectedResult'),
              difficulty: 'easy'
            },
            {
              id: 'transaction-filtering',
              title: t('banking.testingGuide.scenarios.transactionFiltering.title'),
              description: t('banking.testingGuide.scenarios.transactionFiltering.description'),
              steps: [
                t('banking.testingGuide.scenarios.transactionFiltering.steps.1'),
                t('banking.testingGuide.scenarios.transactionFiltering.steps.2'),
                t('banking.testingGuide.scenarios.transactionFiltering.steps.3'),
                t('banking.testingGuide.scenarios.transactionFiltering.steps.4'),
                t('banking.testingGuide.scenarios.transactionFiltering.steps.5'),
                t('banking.testingGuide.scenarios.transactionFiltering.steps.6')
              ],
              expectedResult: t('banking.testingGuide.scenarios.transactionFiltering.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'bill-payment',
              title: t('banking.testingGuide.scenarios.billPayment.title'),
              description: t('banking.testingGuide.scenarios.billPayment.description'),
              steps: [
                t('banking.testingGuide.scenarios.billPayment.steps.1'),
                t('banking.testingGuide.scenarios.billPayment.steps.2'),
                t('banking.testingGuide.scenarios.billPayment.steps.3'),
                t('banking.testingGuide.scenarios.billPayment.steps.4'),
                t('banking.testingGuide.scenarios.billPayment.steps.5'),
                t('banking.testingGuide.scenarios.billPayment.steps.6')
              ],
              expectedResult: t('banking.testingGuide.scenarios.billPayment.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'transfer-validation',
              title: t('banking.testingGuide.scenarios.transferValidation.title'),
              description: t('banking.testingGuide.scenarios.transferValidation.description'),
              steps: [
                t('banking.testingGuide.scenarios.transferValidation.steps.1'),
                t('banking.testingGuide.scenarios.transferValidation.steps.2'),
                t('banking.testingGuide.scenarios.transferValidation.steps.3'),
                t('banking.testingGuide.scenarios.transferValidation.steps.4'),
                t('banking.testingGuide.scenarios.transferValidation.steps.5'),
                t('banking.testingGuide.scenarios.transferValidation.steps.6'),
                t('banking.testingGuide.scenarios.transferValidation.steps.7')
              ],
              expectedResult: t('banking.testingGuide.scenarios.transferValidation.expectedResult'),
              difficulty: 'hard'
            },
            {
              id: 'statement-download',
              title: t('banking.testingGuide.scenarios.statementDownload.title'),
              description: t('banking.testingGuide.scenarios.statementDownload.description'),
              steps: [
                t('banking.testingGuide.scenarios.statementDownload.steps.1'),
                t('banking.testingGuide.scenarios.statementDownload.steps.2'),
                t('banking.testingGuide.scenarios.statementDownload.steps.3'),
                t('banking.testingGuide.scenarios.statementDownload.steps.4'),
                t('banking.testingGuide.scenarios.statementDownload.steps.5'),
                t('banking.testingGuide.scenarios.statementDownload.steps.6')
              ],
              expectedResult: t('banking.testingGuide.scenarios.statementDownload.expectedResult'),
              difficulty: 'easy'
            }
          ]}
          tips={[
            t('banking.testingGuide.tips.1'),
            t('banking.testingGuide.tips.2'),
            t('banking.testingGuide.tips.3'),
            t('banking.testingGuide.tips.4'),
            t('banking.testingGuide.tips.5'),
            t('banking.testingGuide.tips.6')
          ]}
          dataTestIds={[
            { element: 'account-selector', description: t('banking.testingGuide.testIds.accountSelector') },
            { element: 'balance-display', description: t('banking.testingGuide.testIds.balanceDisplay') },
            { element: 'transfer-button', description: t('banking.testingGuide.testIds.transferButton') },
            { element: 'pin-input', description: t('banking.testingGuide.testIds.pinInput') },
            { element: 'transaction-search', description: t('banking.testingGuide.testIds.transactionSearch') },
            { element: 'category-filter', description: t('banking.testingGuide.testIds.categoryFilter') },
            { element: 'quick-action-*', description: t('banking.testingGuide.testIds.quickActions') },
            { element: 'transaction-row', description: t('banking.testingGuide.testIds.transactionRow') }
          ]}
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa')}
          className="mb-6 inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          data-testid="back-to-qa-hub"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('banking.testingGuide.backButton')}
        </button>
        
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.account.overview')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedAccount === account.id ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow hover:shadow-md'
                  }`}
                  data-testid={`account-${account.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{account.type}</p>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{account.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{account.number}</p>
                    </div>
                    {selectedAccount === account.id && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{t('banking.account.selected')}</span>
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${account.balance < 0 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                    {formatCurrency(Math.abs(account.balance), currentLocale)}
                  </p>
                  {account.type === t('banking.account.type.savings') && (
                    <p className="text-xs text-green-600 mt-1">{t('banking.account.apy')}</p>
                  )}
                  {account.type === t('banking.account.type.credit') && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('banking.account.availableCredit')}</span>
                        <span>{formatCurrency(getLocalizedBalance(8765.25), currentLocale)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '12.35%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Total Balance Card */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.account.totalBalance')}</h2>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">{t('banking.account.allAccounts')}</p>
              <p className="text-3xl font-bold mb-4" data-testid="total-balance">
                {formatCurrency(totalBalance, currentLocale)}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">{t('banking.account.thisMonth')}</span>
                  <span className="font-semibold text-green-300">+{formatCurrency(getLocalizedBalance(2340.50), currentLocale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">{t('banking.account.lastMonth')}</span>
                  <span className="font-semibold">+{formatCurrency(getLocalizedBalance(1890.25), currentLocale)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.quickActions.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow text-center"
                data-testid={`quick-action-${action.id}`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('banking.transactions.title')}</h2>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline" data-testid="view-all-transactions">
                    {t('banking.transactions.viewAll')}
                  </button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder={t('banking.transactions.searchPlaceholder')}
                    value={searchTransaction}
                    onChange={(e) => setSearchTransaction(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    data-testid="search-transactions"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    data-testid="category-filter"
                  >
                    <option value="all">{t('banking.transactions.allCategories')}</option>
                    <option value="Shopping">{t('banking.transactions.categories.shopping')}</option>
                    <option value="Food">{t('banking.transactions.categories.food')}</option>
                    <option value="Transport">{t('banking.transactions.categories.transport')}</option>
                    <option value="Entertainment">{t('banking.transactions.categories.entertainment')}</option>
                    <option value="Utilities">{t('banking.transactions.categories.utilities')}</option>
                    <option value="Income">{t('banking.transactions.categories.income')}</option>
                  </select>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100" data-testid="date-filter">
                    {t('banking.transactions.dateRange')}
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" data-testid="export-btn">
                    {t('banking.transactions.export')}
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), currentLocale)}
                        </p>
                        {transaction.status === 'pending' && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('banking.transactions.pending')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Bills & Spending Insights */}
          <div className="space-y-6">
            {/* Upcoming Bills */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.bills.title')}</h2>
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    data-testid={`upcoming-bill-${bill.id}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{bill.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('banking.bills.due')} {bill.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(bill.amount, currentLocale)}</p>
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{t('banking.bills.payNow')}</button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowManageBillsModal(true)}
                className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                data-testid="manage-bills-btn"
              >
                {t('banking.bills.manageAll')}
              </button>
            </div>

            {/* Spending Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.insights.title')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('banking.insights.shopping')}</span>
                    <span className="font-medium">{formatCurrency(getLocalizedBalance(450.00), currentLocale)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('banking.insights.foodDining')}</span>
                    <span className="font-medium">{formatCurrency(getLocalizedBalance(320.00), currentLocale)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('banking.insights.transport')}</span>
                    <span className="font-medium">{formatCurrency(getLocalizedBalance(180.00), currentLocale)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('banking.insights.utilities')}</span>
                    <span className="font-medium">{formatCurrency(getLocalizedBalance(150.00), currentLocale)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ {t('banking.insights.warning')}
                </p>
              </div>
            </div>

            {/* Security Alert */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('banking.security.title')}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('banking.security.twoFactorAuth')}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded">{t('banking.security.enabled')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('banking.security.loginAlerts')}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded">{t('banking.security.active')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('banking.security.lastPasswordChange')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">30 {t('banking.security.daysAgo')}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                data-testid="security-settings-btn"
              >
                {t('banking.security.settings')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="transfer-modal">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('banking.modals.transfer.title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.transfer.fromAccount')}</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg" data-testid="transfer-from">
                  <option value="checking">{t('banking.account.checking')} - {formatCurrency(getLocalizedBalance(5432.10), currentLocale)}</option>
                  <option value="savings">{t('banking.account.savings')} - {formatCurrency(getLocalizedBalance(12000.50), currentLocale)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.transfer.toAccount')}</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder={t('banking.modals.transfer.toPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="transfer-to"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.transfer.amount')}</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="transfer-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.transfer.memo')}</label>
                <input
                  type="text"
                  placeholder={t('banking.modals.transfer.memoPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="transfer-memo"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                data-testid="transfer-cancel"
              >
                {t('banking.modals.transfer.cancel')}
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="transfer-submit"
              >
                {t('banking.modals.transfer.continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full" data-testid="pin-modal">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('banking.modals.pin.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('banking.modals.pin.description')}</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl"
              data-testid="pin-input"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('banking.modals.pin.hint')}</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                data-testid="pin-cancel"
              >
                {t('banking.modals.pin.cancel')}
              </button>
              <button
                onClick={handlePinSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="pin-submit"
              >
                {t('banking.modals.pin.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {showPayBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="pay-bill-modal">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('banking.modals.payBill.title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.payBill.selectBiller')}</label>
                <select
                  value={selectedBiller}
                  onChange={(e) => setSelectedBiller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="select-biller"
                >
                  <option value="">{t('banking.modals.payBill.chooseBiller')}</option>
                  <option value="electric">{t('banking.modals.payBill.billers.electric')}</option>
                  <option value="internet">{t('banking.modals.payBill.billers.internet')}</option>
                  <option value="phone">{t('banking.modals.payBill.billers.phone')}</option>
                  <option value="insurance">{t('banking.modals.payBill.billers.insurance')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.payBill.amount')}</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="bill-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('banking.modals.payBill.paymentDate')}</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
                  data-testid="payment-date"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPayBillModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                data-testid="bill-cancel"
              >
                {t('banking.modals.payBill.cancel')}
              </button>
              <button
                onClick={handlePayBill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="bill-submit"
              >
                {t('banking.modals.payBill.schedulePayment')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Bills Modal */}
      {showManageBillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" data-testid="manage-bills-modal">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('banking.modals.manageBills.title')}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">{t('banking.modals.manageBills.scheduledBills')}</h4>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  data-testid="add-new-biller"
                >
                  {t('banking.modals.manageBills.addNewBiller')}
                </button>
              </div>
              
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">{bill.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('banking.modals.manageBills.dueDate')}: {bill.dueDate}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('banking.modals.manageBills.amount')}: {formatCurrency(bill.amount, currentLocale)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bill.autoPay}
                          onChange={(e) => {
                            setUpcomingBills(bills => 
                              bills.map(b => 
                                b.id === bill.id ? { ...b, autoPay: e.target.checked } : b
                              )
                            );
                            toast.success(
                              e.target.checked 
                                ? t('banking.messages.autoPayEnabled') 
                                : t('banking.messages.autoPayDisabled')
                            );
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          data-testid={`autopay-${bill.id}`}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t('banking.modals.manageBills.autoPay')}
                        </span>
                      </label>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        onClick={() => {
                          setSelectedBiller(bill.name);
                          setBillAmount(bill.amount.toString());
                          setShowPayBillModal(true);
                          setShowManageBillsModal(false);
                        }}
                        data-testid={`pay-bill-${bill.id}`}
                      >
                        {t('banking.modals.manageBills.payNow')}
                      </button>
                      <button 
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        onClick={() => {
                          setUpcomingBills(bills => bills.filter(b => b.id !== bill.id));
                          toast.success(t('banking.messages.billRemoved'));
                        }}
                        data-testid={`remove-bill-${bill.id}`}
                      >
                        {t('banking.modals.manageBills.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  {t('banking.modals.manageBills.paymentHistory')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Electric Company - Jan 2024</span>
                    <span className="text-green-600">{formatCurrency(getLocalizedBalance(98.50), currentLocale)} ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Internet Provider - Dec 2023</span>
                    <span className="text-green-600">{formatCurrency(getLocalizedBalance(79.99), currentLocale)} ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Phone Bill - Dec 2023</span>
                    <span className="text-green-600">{formatCurrency(getLocalizedBalance(45.00), currentLocale)} ✓</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowManageBillsModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                data-testid="manage-bills-close"
              >
                {t('banking.modals.manageBills.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="security-modal">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('banking.modals.security.title')}</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {t('banking.modals.security.twoFactorAuth')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('banking.modals.security.twoFactorDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={twoFactorEnabled}
                      onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        toast.success(
                          e.target.checked 
                            ? t('banking.messages.twoFactorEnabled')
                            : t('banking.messages.twoFactorDisabled')
                        );
                      }}
                      className="sr-only peer"
                      data-testid="two-factor-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {t('banking.modals.security.loginAlerts')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('banking.modals.security.loginAlertsDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={loginAlertsEnabled}
                      onChange={(e) => {
                        setLoginAlertsEnabled(e.target.checked);
                        toast.success(
                          e.target.checked 
                            ? t('banking.messages.loginAlertsEnabled')
                            : t('banking.messages.loginAlertsDisabled')
                        );
                      }}
                      className="sr-only peer"
                      data-testid="login-alerts-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    toast.success(t('banking.messages.passwordChangeInitiated'));
                  }}
                  data-testid="change-password-btn"
                >
                  {t('banking.modals.security.changePassword')}
                </button>
                
                <button 
                  className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  onClick={() => {
                    setPin('');
                    setShowPinModal(true);
                    setShowSecurityModal(false);
                  }}
                  data-testid="change-pin-btn"
                >
                  {t('banking.modals.security.changePin')}
                </button>
                
                <button 
                  className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => {
                    toast.success(t('banking.messages.deviceManagementOpened'));
                  }}
                  data-testid="manage-devices-btn"
                >
                  {t('banking.modals.security.manageDevices')}
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>{t('banking.modals.security.securityTip')}:</strong> {t('banking.modals.security.securityTipDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                data-testid="security-close"
              >
                {t('banking.modals.security.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingDashboardPage;