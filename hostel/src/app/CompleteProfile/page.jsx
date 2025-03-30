'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: '',
        gender: '',
        age: '',
        mobile_number: '',
        address: '',
        emergency_number: '',
        parent_contact: '',
        roll_number: '',
        college_name: ''
    });
    
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:5000/api/completeProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Profile updated successfully!');
                router.push('/Dashboard'); // Redirect after profile completion
            } else {
                setMessage(data.error || 'Profile update failed');
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 w-80">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2" required />

                <label>Gender</label>
                <select name="gender" onChange={handleChange} className="border p-2" required>
                    <option value="">Select Gender</option>
                    <option value="Male">MALE</option>
                    <option value="Female">FEMALE</option>
                    <option value="Other">Other</option>
                </select>

                <label>Age</label>
                <input type="number" name="age" placeholder="Age" onChange={handleChange} className="border p-2" required />
                
                <label>Mobile Number</label>
                <input type="text" name="mobile_number" placeholder="Mobile Number" onChange={handleChange} className="border p-2" required />
                
                <label>Address</label>
                <input type="text" name="address" placeholder="Address" onChange={handleChange} className="border p-2" required />
                
                <label>Emergency Contact</label>
                <input type="text" name="emergency_number" placeholder="Emergency Contact" onChange={handleChange} className="border p-2" required />
                
                <label>Parent Contact</label>
                <input type="text" name="parent_contact" placeholder="Parent Contact" onChange={handleChange} className="border p-2" required />
                
                <label>Roll Number</label>
                <input type="text" name="roll_number" placeholder="Roll Number" onChange={handleChange} className="border p-2" required />
                
                <label>College Name</label>
                <input type="text" name="college_name" placeholder="College Name" onChange={handleChange} className="border p-2" required />
                
                <button type="submit" className="bg-blue-500 text-white p-2">Complete Profile</button>
            </form>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}
