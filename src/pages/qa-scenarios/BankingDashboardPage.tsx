import { useState } from 'react';
import { toast } from 'react-hot-toast';

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
  const [selectedAccount, setSelectedAccount] = useState('checking');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
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

  const accounts: Account[] = [
    { id: 'checking', name: 'Checking Account', type: 'Checking', number: '****1234', balance: 5432.10, currency: 'USD' },
    { id: 'savings', name: 'Savings Account', type: 'Savings', number: '****5678', balance: 12000.50, currency: 'USD' },
    { id: 'credit', name: 'Credit Card', type: 'Credit', number: '****9012', balance: -1234.75, currency: 'USD' },
    { id: 'investment', name: 'Investment Account', type: 'Investment', number: '****3456', balance: 45678.90, currency: 'USD' },
  ];

  const transactions: Transaction[] = [
    { id: 'TXN001', date: '2024-01-20', description: 'Amazon Purchase', category: 'Shopping', amount: -89.99, type: 'debit', status: 'completed' },
    { id: 'TXN002', date: '2024-01-20', description: 'Salary Deposit', category: 'Income', amount: 3500.00, type: 'credit', status: 'completed' },
    { id: 'TXN003', date: '2024-01-19', description: 'Uber Ride', category: 'Transport', amount: -23.45, type: 'debit', status: 'completed' },
    { id: 'TXN004', date: '2024-01-19', description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, type: 'debit', status: 'completed' },
    { id: 'TXN005', date: '2024-01-18', description: 'Grocery Store', category: 'Food', amount: -156.78, type: 'debit', status: 'completed' },
    { id: 'TXN006', date: '2024-01-18', description: 'ATM Withdrawal', category: 'Cash', amount: -200.00, type: 'debit', status: 'pending' },
    { id: 'TXN007', date: '2024-01-17', description: 'Electric Bill', category: 'Utilities', amount: -98.50, type: 'debit', status: 'completed' },
    { id: 'TXN008', date: '2024-01-17', description: 'Refund - Online Order', category: 'Shopping', amount: 45.00, type: 'credit', status: 'completed' },
  ];

  const quickActions = [
    { id: 'transfer', label: 'Transfer Money', icon: '💸' },
    { id: 'pay-bill', label: 'Pay Bills', icon: '📄' },
    { id: 'deposit', label: 'Mobile Deposit', icon: '📱' },
    { id: 'send-money', label: 'Send Money', icon: '💰' },
    { id: 'cards', label: 'Manage Cards', icon: '💳' },
    { id: 'statements', label: 'Statements', icon: '📊' },
  ];

  const upcomingBills = [
    { id: 1, name: 'Electric Company', dueDate: '2024-01-25', amount: 98.50 },
    { id: 2, name: 'Internet Provider', dueDate: '2024-01-28', amount: 79.99 },
    { id: 3, name: 'Phone Bill', dueDate: '2024-02-01', amount: 45.00 },
    { id: 4, name: 'Insurance', dueDate: '2024-02-05', amount: 250.00 },
  ];

  const handleTransfer = () => {
    if (!transferAmount || !transferTo) {
      toast.error('Please fill all fields');
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      toast.success('Transfer initiated successfully!');
      setShowTransferModal(false);
      setShowPinModal(false);
      setPin('');
      setTransferAmount('');
      setTransferTo('');
    } else {
      toast.error('Invalid PIN');
    }
  };

  const handlePayBill = () => {
    if (!selectedBiller || !billAmount) {
      toast.error('Please select a biller and enter amount');
      return;
    }
    toast.success('Bill payment scheduled!');
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
        toast.info('Opening camera for mobile deposit...');
        break;
      case 'send-money':
        toast.info('Send money feature coming soon!');
        break;
      case 'cards':
        toast.info('Card management feature coming soon!');
        break;
      case 'statements':
        setShowStatementModal(true);
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-testid="banking-header">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-sm text-gray-500">Last login: Today at 9:30 AM</p>
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`bg-white rounded-lg p-6 cursor-pointer transition-all ${
                    selectedAccount === account.id ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow hover:shadow-md'
                  }`}
                  data-testid={`account-${account.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">{account.type}</p>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-xs text-gray-500">{account.number}</p>
                    </div>
                    {selectedAccount === account.id && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Selected</span>
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  {account.type === 'Savings' && (
                    <p className="text-xs text-green-600 mt-1">+2.5% APY</p>
                  )}
                  {account.type === 'Credit' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Available Credit</span>
                        <span>$8,765.25</span>
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
            <h2 className="text-lg font-semibold mb-4">Total Balance</h2>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">All Accounts</p>
              <p className="text-3xl font-bold mb-4" data-testid="total-balance">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">This Month</span>
                  <span className="font-semibold text-green-300">+$2,340.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Last Month</span>
                  <span className="font-semibold">+$1,890.25</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-center"
                data-testid={`quick-action-${action.id}`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-sm text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  <button className="text-sm text-blue-600 hover:underline" data-testid="view-all-transactions">
                    View All
                  </button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTransaction}
                    onChange={(e) => setSearchTransaction(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    data-testid="search-transactions"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    data-testid="category-filter"
                  >
                    <option value="all">All Categories</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Income">Income</option>
                  </select>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" data-testid="date-filter">
                    Date Range
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" data-testid="export-btn">
                    Export
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
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
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {transaction.status === 'pending' && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
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
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Bills</h2>
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`upcoming-bill-${bill.id}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{bill.name}</p>
                      <p className="text-sm text-gray-500">Due {bill.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                      <button className="text-xs text-blue-600 hover:underline">Pay Now</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-testid="manage-bills-btn">
                Manage All Bills
              </button>
            </div>

            {/* Spending Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Spending Insights</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shopping</span>
                    <span className="font-medium">$450.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Food & Dining</span>
                    <span className="font-medium">$320.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Transport</span>
                    <span className="font-medium">$180.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilities</span>
                    <span className="font-medium">$150.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ You've spent 23% more than last month
                </p>
              </div>
            </div>

            {/* Security Alert */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Security Center</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Auth</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Login Alerts</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Password Change</span>
                  <span className="text-xs text-gray-500">30 days ago</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-testid="security-settings-btn">
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full" data-testid="transfer-modal">
            <h3 className="text-lg font-bold mb-4">Transfer Money</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" data-testid="transfer-from">
                  <option value="checking">Checking - $5,432.10</option>
                  <option value="savings">Savings - $12,000.50</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Enter account number or select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="transfer-to"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="transfer-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memo (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a note"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="transfer-memo"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                data-testid="transfer-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="transfer-submit"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full" data-testid="pin-modal">
            <h3 className="text-lg font-bold mb-4">Enter PIN</h3>
            <p className="text-sm text-gray-600 mb-4">Please enter your 4-digit PIN to confirm the transfer</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl"
              data-testid="pin-input"
            />
            <p className="text-xs text-gray-500 mt-2">Hint: Try 1234</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                data-testid="pin-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="pin-submit"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {showPayBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full" data-testid="pay-bill-modal">
            <h3 className="text-lg font-bold mb-4">Pay Bills</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Biller</label>
                <select
                  value={selectedBiller}
                  onChange={(e) => setSelectedBiller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="select-biller"
                >
                  <option value="">Choose a biller</option>
                  <option value="electric">Electric Company</option>
                  <option value="internet">Internet Provider</option>
                  <option value="phone">Phone Bill</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="bill-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="payment-date"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPayBillModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                data-testid="bill-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handlePayBill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="bill-submit"
              >
                Schedule Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingDashboardPage;