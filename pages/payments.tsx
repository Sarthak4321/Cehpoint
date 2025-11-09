import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { storage, User, Payment } from '../utils/storage';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

export default function Payments() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || currentUser.role !== 'worker') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadPayments(currentUser.id);
  }, [router]);

  const loadPayments = (userId: string) => {
    const allPayments = storage.getPayments();
    setPayments(allPayments.filter(p => p.userId === userId));
  };

  const handleWithdraw = () => {
    if (!user) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    if (!user.payoutAccount?.verified) {
      alert('Please verify your payout account first');
      return;
    }

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      userId: user.id,
      amount: amount,
      type: 'withdrawal',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const allPayments = storage.getPayments();
    storage.setPayments([...allPayments, newPayment]);

    const users = storage.getUsers();
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, balance: u.balance - amount } : u
    );
    storage.setUsers(updatedUsers);
    storage.setCurrentUser({ ...user, balance: user.balance - amount });

    setUser({ ...user, balance: user.balance - amount });
    loadPayments(user.id);
    setWithdrawAmount('');
    setShowWithdraw(false);
    alert('Withdrawal request submitted!');
  };

  const totalEarnings = payments
    .filter(p => p.type === 'task-payment' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalWithdrawn = payments
    .filter(p => p.type === 'withdrawal' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (!user) return null;

  return (
    <Layout>
      <Head>
        <title>Payments - Cehpoint</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Payments & Earnings</h1>
          <Button onClick={() => setShowWithdraw(!showWithdraw)}>
            <Download size={18} />
            <span>Withdraw</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">${user.balance.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Available Balance</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Earned</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalWithdrawn.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Withdrawn</p>
          </Card>
        </div>

        {showWithdraw && (
          <Card className="bg-indigo-50">
            <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter amount"
                  max={user.balance}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Available: ${user.balance.toFixed(2)}
                </p>
              </div>
              {!user.payoutAccount?.verified && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please verify your payout account to withdraw funds
                  </p>
                </div>
              )}
              <div className="flex space-x-3">
                <Button onClick={handleWithdraw} disabled={!user.payoutAccount?.verified}>
                  Confirm Withdrawal
                </Button>
                <Button variant="outline" onClick={() => setShowWithdraw(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {payment.type === 'task-payment' ? 'Task Payment' : 'Withdrawal'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        payment.type === 'task-payment'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {payment.type === 'task-payment' ? '+' : '-'}$
                      {payment.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
