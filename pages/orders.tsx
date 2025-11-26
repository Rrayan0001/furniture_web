import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
    image_url: string;
}

interface Order {
    id: string;
    status: string;
    total_amount: number;
    items: OrderItem[];
    created_at: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        await loadOrders(user.id);
        setLoading(false);
    };

    const loadOrders = async (userId: string) => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading orders:', error);
        } else if (data) {
            setOrders(data);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center bg-[#FAF9F6]">
                    <p>Loading...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>My Orders - granger vintage</title>
            </Head>
            <main className="min-h-screen bg-[#FAF9F6]">
                <Header />

                <section className="w-full bg-[#FAF9F6] pt-[120px] pb-20">
                    <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-[28px] md:text-[40px] font-bold text-black">My Orders</h1>
                            <Link href="/profile" className="text-black underline hover:opacity-70">
                                Back to Profile
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {orders.length === 0 ? (
                                <div className="bg-white p-8 text-center shadow-sm">
                                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                                    <Link href="/shop" className="px-6 py-3 bg-black text-white inline-block hover:bg-gray-800 transition-colors">
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id} className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
                                        <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-gray-100 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                                <p className="font-mono text-sm">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Date</p>
                                                <p className="font-medium">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Total</p>
                                                <p className="font-bold">${order.total_amount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 relative overflow-hidden">
                                                        {item.image_url && (
                                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-black">{item.name}</h3>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-medium">${item.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
