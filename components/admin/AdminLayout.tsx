import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const AdminLayout = ({ children, title = 'Dashboard' }: AdminLayoutProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Furni Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/dashboard" className={`block px-4 py-2 rounded ${router.pathname === '/admin/dashboard' ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Dashboard
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Content
                    </div>
                    <Link href="/admin/editor/home" className={`block px-4 py-2 rounded ${router.pathname.includes('/admin/editor') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Page Editor
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Inventory
                    </div>
                    <Link href="/admin/products" className={`block px-4 py-2 rounded ${router.pathname.includes('/admin/products') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Products
                    </Link>
                    <Link href="/admin/categories" className={`block px-4 py-2 rounded ${router.pathname.includes('/admin/categories') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Categories
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">{title}</h2>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
