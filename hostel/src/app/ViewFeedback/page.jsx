"use client";

import { useState, useEffect } from "react";

export default function ViewFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getAllFeedback");
                const data = await response.json();
                if (response.ok) {
                    setFeedbacks(data);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">View Feedback</h1>
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                        <p><strong>Student:</strong> {feedback.student.name} ({feedback.student.email})</p>
                        <p><strong>Issue:</strong> {feedback.issue}</p>
                        <p><strong>Room Number:</strong> {feedback.room_number}</p>
                        <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 