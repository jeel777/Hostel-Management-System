"use client";

import { useState, useEffect } from "react";

export default function GatePass() {
    const [formData, setFormData] = useState({
        student_id: "",
        reason: "",
        leave_date: "",
        arrival_date: "",
        approval: "Pending",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData((prevData) => ({
                ...prevData,
                student_id: user.id || "", // Assuming 'id' is stored in user object
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/createGatePass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Gate pass request submitted successfully!");
            setFormData({ student_id: formData.student_id, reason: "", leave_date: "", arrival_date: "", approval: "Pending" });
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Request Gate Pass</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-white cursor-not-allowed"
                />
                <input
                    type="text"
                    name="reason"
                    placeholder="Reason for Leave"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="date"
                    name="leave_date"
                    value={formData.leave_date}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="date"
                    name="arrival_date"
                    value={formData.arrival_date}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
                    Submit Gate Pass
                </button>
            </form>
        </div>
    );
}
