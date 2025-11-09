import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { storage, User, Task } from '../../utils/storage';
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    
    const allUsers = storage.getUsers();
    setWorkers(allUsers.filter(u => u.role === 'worker'));
    setTasks(storage.getTasks());
  }, [router]);

  if (!user) return null;

  const activeWorkers = workers.filter(w => w.accountStatus === 'active').length;
  const pendingWorkers = workers.filter(w => w.accountStatus === 'pending').length;
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const totalPayout = tasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.weeklyPayout, 0);

  const stats = [
    {
      label: 'Total Workers',
      value: workers.length,
      subValue: `${activeWorkers} active`,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Approval',
      value: pendingWorkers,
      subValue: `${workers.length - pendingWorkers} approved`,
      icon: Users,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Active Tasks',
      value: activeTasks,
      subValue: `${tasks.length} total tasks`,
      icon: Briefcase,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Payouts',
      value: `$${totalPayout}`,
      subValue: 'All time',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - Cehpoint</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage workers, tasks, and platform operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Workers</h2>
            <div className="space-y-3">
              {workers.slice(0, 5).map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{worker.fullName}</p>
                    <p className="text-sm text-gray-600">{worker.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    worker.accountStatus === 'active' ? 'bg-green-100 text-green-700' :
                    worker.accountStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {worker.accountStatus}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
