"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewGatePasses() {
    const router = useRouter();
    const [gatePasses, setGatePasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGatePasses = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) {
                    router.push("/");
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/gatepass/student/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    // Sort gatepasses by date (newest first)
                    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setGatePasses(sortedData);
                }
            } catch (error) {
                console.error("Error fetching gatepasses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGatePasses();
    }, [router]);

    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-500";
            case "REJECTED":
                return "bg-red-500";
            case "PENDING":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
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
                    <h1 className="text-2xl font-bold">My Gate Pass Requests</h1>
                    <button
                        onClick={() => router.push("/Dashboard")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="space-y-4">
                    {gatePasses.length === 0 ? (
                        <div className="text-center text-gray-400">
                            No gate pass requests found.
                        </div>
                    ) : (
                        gatePasses.map((gatePass) => (
                            <div
                                key={gatePass.id}
                                className="bg-gray-800 p-4 rounded-lg shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {new Date(gatePass.leave_date).toLocaleDateString()} -{" "}
                                            {new Date(gatePass.arrival_date).toLocaleDateString()}
                                        </h3>
                                        <p className="text-gray-300 mt-2">{gatePass.reason}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                            gatePass.approval
                                        )}`}
                                    >
                                        {gatePass.approval}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Requested on: {new Date(gatePass.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 