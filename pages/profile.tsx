import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
}

interface UserAddress {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    is_default: boolean;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);

    // Profile form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    // Address form
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [addressLabel, setAddressLabel] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('India');

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        setUser(user);
        await loadProfile(user.id);
        await loadAddresses(user.id);
        setLoading(false);
    };

    const loadProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data) {
            setProfile(data);
            setFirstName((data as any).first_name || '');
            setLastName((data as any).last_name || '');
            setPhone((data as any).phone || '');
        }
    };

    const loadAddresses = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (data) {
            setAddresses(data);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const profileData = {
            user_id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            phone,
            updated_at: new Date().toISOString()
        };

        if (profile) {
            const { error } = await supabase
                .from('user_profiles')
                // @ts-ignore
                .update(profileData)
                .eq('user_id', user.id);

            if (error) {
                alert('Error updating profile: ' + error.message);
            } else {
                alert('Profile updated successfully!');
                loadProfile(user.id);
            }
        } else {
            const { error } = await supabase
                .from('user_profiles')
                // @ts-ignore
                .insert(profileData);

            if (error) {
                alert('Error creating profile: ' + error.message);
            } else {
                alert('Profile created successfully!');
                loadProfile(user.id);
            }
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const addressData = {
            user_id: user.id,
            label: addressLabel,
            address,
            city,
            state,
            pincode,
            country,
            is_default: addresses.length === 0 // First address is default
        };

        if (editingAddressId) {
            const { error } = await supabase
                .from('user_addresses')
                // @ts-ignore
                .update(addressData)
                .eq('id', editingAddressId);

            if (error) {
                alert('Error updating address: ' + error.message);
            } else {
                alert('Address updated successfully!');
                resetAddressForm();
                loadAddresses(user.id);
            }
        } else {
            const { error } = await supabase
                .from('user_addresses')
                // @ts-ignore
                .insert(addressData);

            if (error) {
                alert('Error adding address: ' + error.message);
            } else {
                alert('Address added successfully!');
                resetAddressForm();
                loadAddresses(user.id);
            }
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        const { error } = await supabase
            .from('user_addresses')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting address: ' + error.message);
        } else {
            loadAddresses(user!.id);
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!user) return;

        // Unset all defaults
        await supabase
            .from('user_addresses')
            // @ts-ignore
            .update({ is_default: false })
            .eq('user_id', user.id);

        // Set new default
        const { error } = await supabase
            .from('user_addresses')
            // @ts-ignore
            .update({ is_default: true })
            .eq('id', id);

        if (error) {
            alert('Error setting default address: ' + error.message);
        } else {
            loadAddresses(user.id);
        }
    };

    const startEditAddress = (addr: UserAddress) => {
        setEditingAddressId(addr.id);
        setAddressLabel(addr.label);
        setAddress(addr.address);
        setCity(addr.city);
        setState(addr.state);
        setPincode(addr.pincode);
        setCountry(addr.country);
        setShowAddressForm(true);
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressLabel('');
        setAddress('');
        setCity('');
        setState('');
        setPincode('');
        setCountry('India');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
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
                <title>My Profile - granger vintage</title>
            </Head>
            <main className="min-h-screen bg-[#FAF9F6]">
                <Header />

                <section className="w-full bg-[#FAF9F6] pt-[120px] pb-20">
                    <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-[28px] md:text-[40px] font-bold text-black">My Profile</h1>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white p-6 md:p-8 mb-8 shadow-sm">
                            <h2 className="text-[20px] font-bold text-black mb-6">Personal Information</h2>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                                >
                                    Save Profile
                                </button>
                            </form>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white p-6 md:p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-[20px] font-bold text-black">Delivery Addresses</h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors text-sm"
                                >
                                    {showAddressForm ? 'Cancel' : '+ Add New Address'}
                                </button>
                            </div>

                            {/* Address Form */}
                            {showAddressForm && (
                                <form onSubmit={handleSaveAddress} className="mb-8 p-6 border border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-medium mb-4">
                                        {editingAddressId ? 'Edit Address' : 'New Address'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Label (e.g., Home, Work)</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressLabel}
                                                onChange={(e) => setAddressLabel(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                            <input
                                                type="text"
                                                required
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={pincode}
                                                    onChange={async (e) => {
                                                        const val = e.target.value;
                                                        setPincode(val);
                                                        if (val.length === 6) {
                                                            try {
                                                                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                                                                const data = await res.json();
                                                                if (data[0].Status === 'Success') {
                                                                    const details = data[0].PostOffice[0];
                                                                    setCity(details.District);
                                                                    setState(details.State);
                                                                    setCountry(details.Country);
                                                                }
                                                            } catch (err) {
                                                                console.error("Error fetching pincode details", err);
                                                            }
                                                        }
                                                    }}
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit pincode"
                                                    autoComplete="postal-code"
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    autoComplete="country-name"
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    autoComplete="address-level2"
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    autoComplete="address-level1"
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                                            >
                                                {editingAddressId ? 'Update Address' : 'Save Address'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetAddressForm}
                                                className="px-6 py-3 border border-gray-300 text-black hover:bg-gray-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            <div className="space-y-4">
                                {addresses.length === 0 ? (
                                    <p className="text-gray-600 py-8 text-center">No addresses saved yet.</p>
                                ) : (
                                    addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className={`p-4 border-2 ${addr.is_default ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-black">{addr.label}</h3>
                                                        {addr.is_default && (
                                                            <span className="px-2 py-1 bg-black text-white text-xs">DEFAULT</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{addr.address}</p>
                                                    <p className="text-sm text-gray-700">
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                    <p className="text-sm text-gray-700">{addr.country}</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => startEditAddress(addr)}
                                                        className="text-sm text-black underline hover:opacity-70"
                                                    >
                                                        Edit
                                                    </button>
                                                    {!addr.is_default && (
                                                        <button
                                                            onClick={() => handleSetDefault(addr.id)}
                                                            className="text-sm text-black underline hover:opacity-70"
                                                        >
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="text-sm text-red-600 underline hover:opacity-70"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
