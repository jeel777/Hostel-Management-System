"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ViewRooms() {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/roomAssignments");
                if (response.ok) {
                    const data = await response.json();
                    setRooms(data);
                } else {
                    throw new Error("Failed to fetch room assignments");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Room Assignments</h1>
                    <button
                        onClick={() => router.push("/AdminDashboard")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <div key={room.room_id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 text-center">Room {room.room_id}</h2>
                                {room.students.length > 0 ? (
                                    <div className="space-y-4">
                                        {room.students.map((student, index) => (
                                            <div key={index} className="border-t border-gray-700 pt-4">
                                                <h3 className="font-medium text-blue-400 mb-2">Student {index + 1}</h3>
                                                <div className="space-y-2">
                                                    <p><span className="font-medium">Name:</span> {student.name}</p>
                                                    <p><span className="font-medium">Email:</span> {student.email}</p>
                                                    <p><span className="font-medium">Mobile:</span> {student.mobile_number}</p>
                                                    <p><span className="font-medium">Address:</span> {student.address}</p>
                                                    <p><span className="font-medium">Emergency Contact:</span> {student.emergency_number}</p>
                                                    <p><span className="font-medium">Parent Contact:</span> {student.parent_contact}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center">No students assigned</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 