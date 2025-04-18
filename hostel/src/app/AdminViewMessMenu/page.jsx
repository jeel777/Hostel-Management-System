"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminViewMessMenu() {
    const router = useRouter();
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/messMenu");
                if (response.ok) {
                    const data = await response.json();
                    setMenu(data);
                } else {
                    throw new Error("Failed to fetch menu");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mealTypes = ["Breakfast", "Lunch", "Hi-Tea", "Dinner"];

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
                    <h1 className="text-2xl font-bold">Weekly Mess Menu</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => router.push("/MessMenu")}
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Edit Menu
                        </button>
                        <button
                            onClick={() => router.push("/AdminDashboard")}
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {days.map(day => (
                            <div key={day} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 text-center">{day}</h2>
                                <div className="space-y-4">
                                    {mealTypes.map(type => (
                                        <div key={type} className="space-y-2">
                                            <h3 className="font-medium text-blue-400">{type}</h3>
                                            <ul className="list-disc list-inside text-gray-300">
                                                {menu[day]?.[type]?.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                )) || <li className="text-gray-500">No items added</li>}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 