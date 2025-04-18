'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await fetch('http://localhost:5000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('✅ Signin successful!');
                router.push('/dashboard'); // Redirect to Dashboard
            } else {
                setMessage(data.error || 'Signin failed');
            }
        } catch (error) {
            setMessage('⚠️ Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md transition-all duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Sign In</h2>
                <p className="text-gray-500 text-sm text-center">Welcome back! Please sign in.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {message && (
                    <p className="mt-3 text-center text-sm font-medium text-red-500 animate-fade-in">
                        {message}
                    </p>
                )}

                <p className="mt-4 text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
