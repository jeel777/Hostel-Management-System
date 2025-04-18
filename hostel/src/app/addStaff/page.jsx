'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddStaff() {
    const [formData, setFormData] = useState({
        name: '',
        contact_number: '',
        date_of_join: '',
        salary: '',
        gender: '',
        age: '',
        role: '',
    });

    const [message, setMessage] = useState('');
    const router = useRouter(); // Initialize the router to perform redirection

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/addStaff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Staff added successfully!');
                setFormData({
                    name: '',
                    contact_number: '',
                    date_of_join: '',
                    salary: '',
                    gender: '',
                    age: '',
                    role: '',
                });

                // Redirect to Admin Dashboard after successful staff addition
                setTimeout(() => {
                    router.push('/AdminDashboard');
                }, 1000); // Adding a slight delay for a better user experience
            } else {
                setMessage(data.error || 'Failed to add staff');
            }
        } catch (error) {
            setMessage('Server error. Try again later.');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold mb-4">Add Staff</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2" required />
                <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} className="border p-2" required />
                <input type="date" name="date_of_join" value={formData.date_of_join} onChange={handleChange} className="border p-2" required />
                <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="border p-2" required />
                
                <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2" required>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="border p-2" required />

                <select name="role" value={formData.role} onChange={handleChange} className="border p-2" required>
                    <option value="">Select Role</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CLEANER">Cleaner</option>
                    <option value="SECURITY">Security</option>
                </select>

                <button type="submit" className="bg-green-500 text-white p-2">Add Staff</button>
            </form>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}
