'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Signin successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect based on user type
                if (data.user.isAdmin) {
                    router.push('/AdminDashboard');
                } else {
                    router.push('/Dashboard');
                }
            } else {
                setMessage(data.error || 'Signin failed');
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold">Sign In</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 w-80">
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2" required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2" required />
                <button type="submit" className="bg-blue-500 text-white p-2">Sign In</button>
            </form>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}
