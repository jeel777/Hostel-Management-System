'use client';

import { useEffect, useState } from 'react';

export default function ViewCommitteeMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/getcommitteeMembers');
                const data = await res.json();

                if (res.ok) {
                    setMembers(data);
                } else {
                    setError(data.error || 'Failed to fetch members');
                }
            } catch (err) {
                setError('Server error while fetching members.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Hostel Committee Members</h2>

            {loading && <p className="text-center">Loading members...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-800 rounded shadow-lg">
                        <thead className="bg-gray-700 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Position</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Date of Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                    <td className="p-3">{member.name}</td>
                                    <td className="p-3">{member.position}</td>
                                    <td className="p-3">{member.contact_number}</td>
                                    <td className="p-3">{member.email}</td>
                                    <td className="p-3">{member.gender}</td>
                                    <td className="p-3">{new Date(member.date_of_join).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
