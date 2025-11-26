import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/editor/home" className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    <h2 className="text-xl font-bold mb-2">Edit Homepage</h2>
                    <p className="text-sm opacity-80">Manage homepage content, products, and sections</p>
                </Link>

                <Link href="/admin/editor/about" className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    <h2 className="text-xl font-bold mb-2">Edit About Page</h2>
                    <p className="text-sm opacity-80">Manage about page content and story</p>
                </Link>

                <Link href="/admin/products" className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    <h2 className="text-xl font-bold mb-2">Manage Products</h2>
                    <p className="text-sm opacity-80">Add, edit, or remove products from your catalog</p>
                </Link>

                <Link href="/admin/categories" className="block p-6 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    <h2 className="text-xl font-bold mb-2">Manage Categories</h2>
                    <p className="text-sm opacity-80">Organize products into categories</p>
                </Link>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
