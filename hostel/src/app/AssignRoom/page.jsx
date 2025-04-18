"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssignRoom() {
    const router = useRouter();
    const [roomId, setRoomId] = useState("");
    const [roomCount, setRoomCount] = useState(0);
    const [studentEmails, setStudentEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoomCount = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getAdminRoomCount");
                if (response.ok) {
                    const data = await response.json();
                    setRoomCount(data.room_count);
                    // Initialize student emails array with empty strings
                    setStudentEmails(new Array(data.room_count).fill(""));
                }
            } catch (error) {
                console.error("Error fetching room count:", error);
                setError("Failed to load room count");
            } finally {
                setLoading(false);
            }
        };

        fetchRoomCount();
    }, []);

    const handleEmailChange = (index, value) => {
        const newEmails = [...studentEmails];
        newEmails[index] = value;
        setStudentEmails(newEmails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Filter out empty emails
        const validEmails = studentEmails.filter(email => email.trim() !== "");

        if (validEmails.length === 0) {
            setError("Please enter at least one student email");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/assignStudentsToRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    room_id: roomId,
                    student_emails: validEmails,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to assign students to room");
            }

            // Reset form
            setRoomId("");
            setStudentEmails(new Array(roomCount).fill(""));
            alert("Students assigned to room successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Assign Students to Room</h1>
                    <button
                        onClick={() => router.push("/AdminDashboard")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Room ID (e.g., D-304)
                            </label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Enter room ID"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Student Emails (Max: {roomCount})
                            </label>
                            <div className="space-y-2">
                                {studentEmails.map((email, index) => (
                                    <input
                                        key={index}
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Student ${index + 1} email`}
                                    />
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Assign Students to Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 