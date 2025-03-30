'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Signup successful!');
                localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
                router.push(`/CompleteProfile?email=${formData.email}`); // Redirect to Complete Profile with email
            } else {
                setMessage(data.error || 'Signup failed');
            }
        } catch (error) {
            setMessage('Error connecting to server');
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold">Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 w-80">
                <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2" required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2" required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2" required />
                <button type="submit" className="bg-blue-500 text-white p-2">Sign Up</button>
            </form>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}
