import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { storage, User, Task } from '../utils/storage';
import { DollarSign, Briefcase, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'worker') {
      router.push('/admin');
      return;
    }
    
    setUser(currentUser);
    
    const tasks = storage.getTasks();
    setMyTasks(tasks.filter(t => t.assignedTo === currentUser.id));
    setAvailableTasks(tasks.filter(t => 
      t.status === 'available' && 
      t.skills.some(skill => currentUser.skills.includes(skill))
    ));
  }, [router]);

  if (!user) return null;

  const stats = [
    {
      label: 'Balance',
      value: `$${user.balance.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Active Tasks',
      value: myTasks.filter(t => t.status === 'in-progress').length,
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Completed',
      value: myTasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Available Tasks',
      value: availableTasks.length,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const handleAcceptTask = (taskId: string) => {
    const tasks = storage.getTasks();
    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: 'in-progress' as const, assignedTo: user.id }
        : t
    );
    storage.setTasks(updatedTasks);
    router.push('/tasks');
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - Cehpoint</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your work progress
          </p>
        </div>

        {!user.demoTaskCompleted && (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900">Complete Your Demo Task</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You need to complete a demo task before accepting regular projects
                </p>
              </div>
              <Button variant="secondary" onClick={() => router.push('/demo-task')}>
                Start Demo
              </Button>
            </div>
          </Card>
        )}

        {user.accountStatus === 'pending' && (
          <Card className="bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900">Account Verification Pending</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your account is under review. You'll be notified once approved.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">My Active Tasks</h2>
            {myTasks.filter(t => t.status === 'in-progress').length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active tasks</p>
            ) : (
              <div className="space-y-3">
                {myTasks.filter(t => t.status === 'in-progress').map(task => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium text-green-600">
                        ${task.weeklyPayout}
                      </span>
                      <Button onClick={() => router.push('/tasks')}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Available Tasks for You</h2>
            {availableTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No available tasks</p>
            ) : (
              <div className="space-y-3">
                {availableTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {task.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium text-green-600">
                        ${task.weeklyPayout}/week
                      </span>
                      <Button 
                        onClick={() => handleAcceptTask(task.id)}
                        disabled={!user.demoTaskCompleted}
                      >
                        Accept Task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
