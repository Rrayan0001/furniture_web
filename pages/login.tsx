import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                alert('Sign up successful! Please check your email to confirm your account.');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                router.push('/profile');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>{isSignUp ? 'Sign Up' : 'Login'} - granger vintage</title>
            </Head>
            <main className="min-h-screen bg-[#FAF9F6]">
                <Header />

                <section className="w-full bg-[#FAF9F6] pt-[120px] pb-20">
                    <div className="max-w-[500px] mx-auto px-4 md:px-8">
                        <div className="bg-white p-8 shadow-sm">
                            <h1 className="text-[28px] md:text-[32px] font-bold text-black mb-8 text-center">
                                {isSignUp ? 'Create Account' : 'Login'}
                            </h1>

                            <form onSubmit={handleAuth} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                        placeholder="Enter password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-sm text-black underline hover:opacity-70"
                                >
                                    {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
