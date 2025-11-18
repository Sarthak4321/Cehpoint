// pages/admin/tasks.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Layout from "../../components/Layout";
import Card from "../../components/Card";
import Button from "../../components/Button";

import { storage } from "../../utils/storage";
import type { User, Task, Payment } from "../../utils/types";

import { Plus } from "lucide-react";

export default function AdminTasks() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    skills: [] as string[],
    weeklyPayout: 500,
    deadline: "",
  });

  const skillOptions = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "PHP",
    "Angular",
    "Vue.js",
    "Video Editing",
    "Adobe Premiere",
    "After Effects",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "SEO",
  ];

  /* -------------------------------------------------------
   * AUTH + INITIAL LOAD
   * ----------------------------------------------------- */
  useEffect(() => {
    const currentUser = storage.getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    loadTasks();
  }, []);

  /* -------------------------------------------------------
   * LOAD TASKS FROM FIRESTORE
   * ----------------------------------------------------- */
  const loadTasks = async () => {
    const list = await storage.getTasks();
    setTasks(list);
  };

  /* -------------------------------------------------------
   * CREATE TASK (Firestore)
   * ----------------------------------------------------- */
  const handleCreateTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.category ||
      newTask.skills.length === 0 ||
      !newTask.deadline
    ) {
      alert("Please fill all fields");
      return;
    }

    const taskPayload: Omit<Task, "id"> = {
      ...newTask,
      status: "available",
      assignedTo: null,
      submissionUrl: "",
      createdAt: new Date().toISOString(),
      createdBy: user!.id,
    };

    await storage.createTask(taskPayload);

    setShowCreate(false);
    setNewTask({
      title: "",
      description: "",
      category: "",
      skills: [],
      weeklyPayout: 500,
      deadline: "",
    });

    await loadTasks();
    alert("Task created successfully!");
  };

  /* -------------------------------------------------------
   * APPROVE TASK
   * ----------------------------------------------------- */
  const handleApproveTask = async (taskId: string) => {
    const job = tasks.find((t) => t.id === taskId);

    if (!job || !job.assignedTo) {
      alert("Task has no assigned worker.");
      return;
    }

    // 1) Update task
    await storage.updateTask(taskId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    // 2) Create payment
    const payment: Omit<Payment, "id"> = {
      userId: job.assignedTo,
      amount: job.weeklyPayout,
      type: "task-payment",
      status: "completed",
      taskId: job.id,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    await storage.createPayment(payment);

    // 3) Reload
    await loadTasks();
    alert("Task approved and payment processed!");
  };

  /* -------------------------------------------------------
   * REJECT TASK
   * ----------------------------------------------------- */
  const handleRejectTask = async (taskId: string) => {
    const feedback = prompt("Enter rejection reason:");
    if (!feedback) return;

    await storage.updateTask(taskId, {
      status: "rejected",
      feedback,
    });

    await loadTasks();
    alert("Task rejected.");
  };

  /* -------------------------------------------------------
   * SKILL TOGGLE
   * ----------------------------------------------------- */
  const handleSkillToggle = (skill: string) => {
    if (newTask.skills.includes(skill)) {
      setNewTask({
        ...newTask,
        skills: newTask.skills.filter((s) => s !== skill),
      });
    } else {
      setNewTask({
        ...newTask,
        skills: [...newTask.skills, skill],
      });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <Head>
        <title>Manage Tasks - Cehpoint</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Tasks</h1>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus size={18} />
            <span>Create Task</span>
          </Button>
        </div>

        {/* CREATE TASK FORM */}
        {showCreate && (
          <Card>
            <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
            <div className="space-y-4">

              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Task title"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Task description"
                />
              </div>

              {/* CATEGORY + PAYOUT */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
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
                  <label className="block text-sm font-medium mb-2">
                    Weekly Payout ($)
                  </label>
                  <input
                    type="number"
                    value={newTask.weeklyPayout}
                    onChange={(e) =>
                      setNewTask({ ...newTask, weeklyPayout: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* DEADLINE */}
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask({ ...newTask, deadline: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* SKILLS */}
              <div>
                <label className="block text-sm font-medium mb-2">Required Skills</label>
                <div className="grid grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        newTask.skills.includes(skill)
                          ? "border-indigo-600 bg-indigo-100 text-indigo-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleCreateTask}>Create Task</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* TASK LIST */}
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <div className="flex justify-between items-start">

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{task.title}</h3>

                  <p className="text-gray-600 mt-2">{task.description}</p>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span> {task.category}
                    </div>
                    <div>
                      <span className="text-gray-500">Payout:</span> ${task.weeklyPayout}
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>{" "}
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>

                {/* Approval Buttons */}
                {task.status === "submitted" && (
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => handleApproveTask(task.id)}>
                      Approve
                    </Button>
                    <Button variant="danger" onClick={() => handleRejectTask(task.id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
