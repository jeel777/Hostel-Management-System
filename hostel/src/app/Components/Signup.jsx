'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('✅ Signup successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push(`/CompleteProfile?email=${formData.email}`);
            } else {
                setMessage(data.error || 'Signup failed');
            }
        } catch (error) {
            setMessage('⚠️ Error connecting to server');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md transition-all duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Create an Account</h2>
                <p className="text-gray-500 text-sm text-center">Sign up to get started</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                        required
                    />

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                {message && (
                    <p className="mt-3 text-center text-sm font-medium text-red-500 animate-fade-in">
                        {message}
                    </p>
                )}

                <p className="mt-4 text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <a href="/signin" className="text-blue-500 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
