"use client";

import { useState, useEffect } from "react";

export default function ManageGatePasses() {
    const [gatePasses, setGatePasses] = useState([]);

    useEffect(() => {
        const fetchGatePasses = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getAllGatePasses");
                const data = await response.json();
                if (response.ok) {
                    setGatePasses(data);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching gate passes:", error);
            }
        };

        fetchGatePasses();
    }, []);

    const updateGatePassStatus = async (id, approval) => {
        try {
            const response = await fetch("http://localhost:5000/api/updateGatePassStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, approval }),
            });

            const data = await response.json();
            if (response.ok) {
                setGatePasses((prev) =>
                    prev.map((pass) => (pass.id === id ? { ...pass, approval } : pass))
                );
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error updating gate pass status:", error);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">Manage Gate Passes</h1>
            <div className="space-y-4">
                {gatePasses.map((pass) => (
                    <div key={pass.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                        <p><strong>Student:</strong> {pass.student.name} ({pass.student.email})</p>
                        <p><strong>Reason:</strong> {pass.reason}</p>
                        <p><strong>Leave Date:</strong> {new Date(pass.leave_date).toLocaleDateString()}</p>
                        <p><strong>Arrival Date:</strong> {new Date(pass.arrival_date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {pass.approval}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => updateGatePassStatus(pass.id, "APPROVED")}
                                className="bg-green-500 px-4 py-2 rounded mr-2 hover:bg-green-600"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => updateGatePassStatus(pass.id, "REJECTED")}
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 