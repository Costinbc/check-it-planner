'use client';
import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/auth';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <Navbar />
            <main>{children}</main>
        </AuthProvider>
        </body>
        </html>
    );
}