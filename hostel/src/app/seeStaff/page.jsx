'use client';

import { useEffect, useState } from 'react';

export default function ManageStaff() {
    const [staff, setStaff] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch the staff data when the component is mounted
        const fetchStaff = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/seeStaff');
                const data = await response.json();

                if (response.ok) {
                    setStaff(data);
                } else {
                    setMessage('Failed to load staff data');
                }
            } catch (error) {
                setMessage('Error connecting to the server');
            }
        };

        fetchStaff();
    }, []);

    // Function to handle removing a staff member
    const handleRemove = async (staffId) => {
        const confirmRemoval = window.confirm('Are you sure you want to remove this staff member?');
        if (!confirmRemoval) return;

        try {
            const response = await fetch(`http://localhost:5000/api/removeStaff/${staffId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Staff removed successfully');
                setStaff(staff.filter((staffMember) => staffMember.id !== staffId)); // Update the list after removal
            } else {
                setMessage(data.error || 'Failed to remove staff');
            }
        } catch (error) {
            setMessage('Error connecting to the server');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-gray-900 text-white">
            <h2 className="text-3xl font-semibold mb-6 text-center">Staff List</h2>

            {message && <p className="text-red-500 mb-4 text-center">{message}</p>}

            <div className="w-full max-w-4xl overflow-hidden bg-gray-800 rounded-lg shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Salary</th>
                            <th className="px-4 py-3">Age</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length > 0 ? (
                            staff.map((staffMember) => (
                                <tr key={staffMember.id} className="border-t border-gray-600 hover:bg-gray-700">
                                    <td className="px-4 py-3">{staffMember.name}</td>
                                    <td className="px-4 py-3">{staffMember.role?.role}</td>
                                    <td className="px-4 py-3">{staffMember.contact_number}</td>
                                    <td className="px-4 py-3">{staffMember.salary}</td>
                                    <td className="px-4 py-3">{staffMember.age}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleRemove(staffMember.id)}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-300">No staff available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
