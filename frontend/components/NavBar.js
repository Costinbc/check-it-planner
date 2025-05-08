import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    TaskMaster
                </Link>

                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/tasks" className="hover:text-blue-200">
                                My Tasks
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link href="/login" className="hover:text-blue-200">
                                Login
                            </Link>
                            <Link href="/register" className="bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
