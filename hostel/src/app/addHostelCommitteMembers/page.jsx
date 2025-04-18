'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCommitteeMember() {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        contact_number: '',
        email: '',
        date_of_join: '',
        gender: '',
    });

    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/addCommitteeMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Member added successfully!');
                setFormData({
                    name: '',
                    position: '',
                    contact_number: '',
                    email: '',
                    date_of_join: '',
                    gender: '',
                });

                // ✅ Redirect after success
                router.push('/AdminDashboard');
            } else {
                setMessage(data.error || 'Failed to add member');
            }
        } catch (error) {
            setMessage('Server error. Try again later.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h2 className="text-2xl font-bold mb-6">Add Hostel Committee Member</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded shadow-md space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="text"
                    name="position"
                    placeholder="Position (e.g., Warden, Member)"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="text"
                    name="contact_number"
                    placeholder="Contact Number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="date"
                    name="date_of_join"
                    value={formData.date_of_join}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                />
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 transition p-2 rounded">
                    Add Member
                </button>

                {message && <p className="text-center text-sm text-red-400">{message}</p>}
            </form>
        </div>
    );
}
