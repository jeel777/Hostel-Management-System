'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Feedback() {
    const [formData, setFormData] = useState({
        issue: "",
        room_number: "",
    });

    const [modal, setModal] = useState({ show: false, message: "", success: true });
    const router = useRouter();
    const [studentId, setStudentId] = useState(""); // Store student ID separately

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setStudentId(user.id || ""); // Set student ID from user object
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId) {
            alert("Student ID is required. Please log in again.");
            return;
        }

        const requestData = {
            student1_id: studentId, // Include student_id in the request data
            ...formData, // Other form data
        };

        const response = await fetch("http://localhost:5000/api/createFeedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if (response.ok) {
            setModal({
                show: true,
                message: "Feedback submitted successfully!",
                success: true,
            });

            // Reset form data
            setFormData({
                issue: "",
                room_number: "",
            });

            // Redirect to /Dashboard after successful feedback submission
            setTimeout(() => {
                router.push("/Dashboard");
            }, 2000);
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
            <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Removed student1_id input field */}
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
