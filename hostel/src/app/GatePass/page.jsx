"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatePass() {
    const [formData, setFormData] = useState({
        student1_id: "",
        reason: "",
        leave_date: "",
        arrival_date: "",
        approval: "PENDING",
    });

    const [modal, setModal] = useState({ show: false, message: "", success: true });
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData((prevData) => ({
                ...prevData,
                student1_id: user.id || "", // Using id from user object as student1_id

            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.student1_id) {
            alert("Student ID is required. Please log in again.");
            return;
        }

        const response = await fetch("http://localhost:5000/api/createGatePass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {

            alert("Gate pass request submitted successfully!");
            setFormData({ student1_id: formData.student1_id, reason: "", leave_date: "", arrival_date: "", approval: "Pending" });

           
        } else {
            setModal({
                show: true,
                message: `Error: ${data.error}`,
                success: false,
            });
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Request Gate Pass</h2>
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

            {modal.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className={`text-lg font-semibold mb-4 ${modal.success ? "text-green-600" : "text-red-600"}`}>
                            {modal.success ? "Success" : "Error"}
                        </h3>
                        <p className="mb-4">{modal.message}</p>
                        {!modal.success && (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => setModal({ ...modal, show: false })}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
