"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/");
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.isAdmin) {
            router.push("/AdminDashboard");
            return;
        }

        setUser(user);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("user");
                        router.push("/signin");
                    }}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </nav>

            {/* Welcome Message */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-semibold">
                    Welcome, {user ? user.name : "Student"}!
                </h2>
            </div>

            {/* Dashboard Sections */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                {/* Feedback Section */}
                <div
                    onClick={() => router.push("/Feedback")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Feedback</h3>
                    <p className="text-gray-300">Submit a complaint or issue.</p>
                </div>

                {/* Gate Pass Section */}
                <div
                    onClick={() => router.push("/GatePass")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Gate Pass</h3>
                    <p className="text-gray-300">Request permission for leaving.</p>
                </div>

                {/* View Gate Passes Section */}
                <div
                    onClick={() => router.push("/ViewGatePasses")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Gate Passes</h3>
                    <p className="text-gray-300">View your gate pass requests.</p>
                </div>

                {/* Fee Payment Section */}
                <div
                    onClick={() => router.push("/FeePayment")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Fee Payment</h3>
                    <p className="text-gray-300">Submit the Fee details Here</p>
                </div>

                {/* View Mess Menu Section */}
                <div
                    onClick={() => router.push("/ViewMessMenu")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Mess Menu</h3>
                    <p className="text-gray-300">Check weekly menu items.</p>
                </div>
                <div
                    onClick={() => router.push("/viewHostelCommitteMembers")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Hostel Committee Members</h3>
                    <p className="text-gray-300">View Hostel Committee Members</p>
                </div>
            </div>
        </div>
    );
}
