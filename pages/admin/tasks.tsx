import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { storage, User, Task, Payment } from '../../utils/storage';
import { Plus, Send } from 'lucide-react';

export default function AdminTasks() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    skills: [] as string[],
    weeklyPayout: 500,
    deadline: '',
  });

  const skillOptions = ['React', 'Node.js', 'Python', 'Java', 'PHP', 'Angular', 'Vue.js', 'Video Editing', 'Adobe Premiere', 'After Effects', 'UI/UX Design', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'SEO'];

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadTasks();
  }, [router]);

  const loadTasks = () => {
    setTasks(storage.getTasks());
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.category || newTask.skills.length === 0 || !newTask.deadline) {
      alert('Please fill all fields');
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
      status: 'available',
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };

    const allTasks = storage.getTasks();
    storage.setTasks([...allTasks, task]);
    
    setNewTask({ title: '', description: '', category: '', skills: [], weeklyPayout: 500, deadline: '' });
    setShowCreate(false);
    loadTasks();
    alert('Task created successfully!');
  };

  const handleApproveTask = (taskId: string) => {
    const allTasks = storage.getTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (!task || !task.assignedTo) return;

    const updatedTasks = allTasks.map(t =>
      t.id === taskId
        ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
        : t
    );
    storage.setTasks(updatedTasks);

    const allUsers = storage.getUsers();
    const updatedUsers = allUsers.map(u =>
      u.id === task.assignedTo
        ? { ...u, balance: u.balance + task.weeklyPayout }
        : u
    );
    storage.setUsers(updatedUsers);

    const payment: Payment = {
      id: `payment-${Date.now()}`,
      userId: task.assignedTo,
      amount: task.weeklyPayout,
      type: 'task-payment',
      status: 'completed',
      taskId: task.id,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    const allPayments = storage.getPayments();
    storage.setPayments([...allPayments, payment]);

    loadTasks();
    alert('Task approved and payment processed!');
  };

  const handleRejectTask = (taskId: string) => {
    const feedback = prompt('Enter rejection reason:');
    if (!feedback) return;

    const allTasks = storage.getTasks();
    const updatedTasks = allTasks.map(t =>
      t.id === taskId
        ? { ...t, status: 'rejected' as const, feedback }
        : t
    );
    storage.setTasks(updatedTasks);
    loadTasks();
    alert('Task rejected with feedback!');
  };

  const handleSkillToggle = (skill: string) => {
    if (newTask.skills.includes(skill)) {
      setNewTask({ ...newTask, skills: newTask.skills.filter(s => s !== skill) });
    } else {
      setNewTask({ ...newTask, skills: [...newTask.skills, skill] });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <Head>
        <title>Manage Tasks - Cehpoint</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Tasks</h1>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus size={18} />
            <span>Create Task</span>
          </Button>
        </div>

        {showCreate && (
          <Card>
            <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select category</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Payout ($)</label>
                  <input
                    type="number"
                    value={newTask.weeklyPayout}
                    onChange={(e) => setNewTask({ ...newTask, weeklyPayout: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Required Skills</label>
                <div className="grid grid-cols-3 gap-2">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition ${
                        newTask.skills.includes(skill)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleCreateTask}>Create Task</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {tasks.map(task => (
            <Card key={task.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{task.description}</p>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div><span className="text-gray-500">Category:</span> {task.category}</div>
                    <div><span className="text-gray-500">Payout:</span> ${task.weeklyPayout}</div>
                    <div><span className="text-gray-500">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}</div>
                  </div>
                  {task.submissionUrl && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Submission:</p>
                      <p className="text-sm text-gray-600 mt-1">{task.submissionUrl}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  {task.status === 'submitted' && (
                    <>
                      <Button onClick={() => handleApproveTask(task.id)} variant="secondary">
                        Approve
                      </Button>
                      <Button onClick={() => handleRejectTask(task.id)} variant="danger">
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
