"use client";

import { useState, useEffect } from "react";

export default function Feedback() {
    const [formData, setFormData] = useState({
        student1_id: "",
        issue: "",
        room_number: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData((prevData) => ({
                ...prevData,
                student1_id: user.id || "", // Assuming 'id' is stored in user object
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/createFeedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Feedback submitted successfully!");
            setFormData({ student1_id: formData.student1_id, issue: "", room_number: "" });
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="student1_id"
                    value={formData.student1_id}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-white cursor-not-allowed"
                />
                <input
                    type="text"
                    name="issue"
                    placeholder="Issue"
                    value={formData.issue}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="text"
                    name="room_number"
                    placeholder="Room Number"
                    value={formData.room_number}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}
