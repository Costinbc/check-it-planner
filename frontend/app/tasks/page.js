'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../lib/api';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('today');
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [user, router]);

    const handleAddTask = async (taskData) => {
        try {
            const newTask = await createTask(taskData);
            setTasks([...tasks, newTask]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            const updatedTask = await updateTask(id, updates);
            setTasks(tasks.map(task => task._id === id ? updatedTask : task));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const filteredTasks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filter) {
            case 'today':
                return tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime() ||
                        (task.recurring && isRecurringToday(task, today));
                });
            case 'upcoming':
                return tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() > today.getTime();
                });
            case 'all':
            default:
                return tasks;
        }
    };

    const isRecurringToday = (task, today) => {
        if (!task.recurring) return false;

        const taskDate = new Date(task.date);
        const daysBetween = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));

        switch (task.recurringType) {
            case 'daily':
                return true;
            case 'weekly':
                return daysBetween % 7 === 0;
            case 'custom':
                return daysBetween % task.customRecurringDays === 0;
            default:
                return false;
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading tasks...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

                <div className="flex mb-4 space-x-4">
                    <button
                        onClick={() => setFilter('today')}
                        className={`px-4 py-2 rounded-lg ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        All Tasks
                    </button>
                </div>

                <TaskForm onAddTask={handleAddTask} />
            </div>

            <TaskList
                tasks={filteredTasks()}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
}