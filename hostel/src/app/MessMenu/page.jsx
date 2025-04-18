"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessMenu() {
    const router = useRouter();
    const [menu, setMenu] = useState({
        day: "Monday",
        meal_type: "Breakfast",
        items: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mealTypes = ["Breakfast", "Lunch", "Hi-Tea", "Dinner"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:5000/api/messMenu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(menu),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add menu item");
            }

            setSuccess("Menu item added successfully!");
            setMenu(prev => ({ ...prev, items: "" })); // Clear items field only
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Mess Menu</h1>
                    <button
                        onClick={() => router.push("/AdminDashboard")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Day
                                </label>
                                <select
                                    value={menu.day}
                                    onChange={(e) => setMenu(prev => ({ ...prev, day: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {days.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Meal Type
                                </label>
                                <select
                                    value={menu.meal_type}
                                    onChange={(e) => setMenu(prev => ({ ...prev, meal_type: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {mealTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Menu Items (comma-separated)
                            </label>
                            <textarea
                                value={menu.items}
                                onChange={(e) => setMenu(prev => ({ ...prev, items: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter menu items separated by commas"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm">{success}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Add Menu Item
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 