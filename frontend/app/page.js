'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                router.push('/tasks');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-6">TaskMaster</h1>
            <p className="text-xl mb-8 max-w-md">
                Organize your life with TaskMaster - the ultimate task management solution with repeating tasks,
                notifications, and cross-device synchronization.
            </p>
            {!user ? (
                <div className="space-x-4">
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Register
                    </Link>
                </div>
            ) : (
                <Link
                    href="/tasks"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Go to Tasks
                </Link>
            )}

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-3">Recurring Tasks</h2>
                    <p>Create tasks that repeat daily, weekly, or on a custom schedule.</p>
                </div>
                <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-3">Reminders</h2>
                    <p>Set notifications to remind you of important tasks.</p>
                </div>
                <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-3">Cross-Device Sync</h2>
                    <p>Access your tasks from any device with real-time synchronization.</p>
                </div>
            </div>
        </div>
    );
}