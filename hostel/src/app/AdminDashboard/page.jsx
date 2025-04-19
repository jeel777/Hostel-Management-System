"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/");
            return;
        }

        const user = JSON.parse(storedUser);
        if (!user.isAdmin) {
            router.push("/Dashboard");
            return;
        }

        setUser(user);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                    Welcome Admin, {user ? user.email : ""}!
                </h2>
            </div>

            {/* Admin Dashboard Sections */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                {/* Manage Gate Passes */}
                <div
                    onClick={() => router.push("/ManageGatePasses")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Manage Gate Passes</h3>
                    <p className="text-gray-300">Review and approve gate pass requests.</p>
                </div>

                {/* View Feedback */}
                <div
                    onClick={() => router.push("/ViewFeedback")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Feedback</h3>
                    <p className="text-gray-300">Review student feedback and complaints.</p>
                </div>

                {/* Assign Room */}
                <div
                    onClick={() => router.push("/AssignRoom")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Assign Room</h3>
                    <p className="text-gray-300">Assign students to rooms.</p>
                </div>

                {/* Manage Mess Menu */}
                <div
                    onClick={() => router.push("/MessMenu")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Manage Mess Menu</h3>
                    <p className="text-gray-300">Add or update weekly menu items.</p>
                </div>

                {/* View Rooms */}
                <div
                    onClick={() => router.push("/ViewRooms")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Rooms</h3>
                    <p className="text-gray-300">View room assignments and student details.</p>
                </div>
                {/* View Mess Menu */}
                <div
                    onClick={() => router.push("/AdminViewMessMenu")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Mess Menu</h3>
                    <p className="text-gray-300">View the current weekly menu.</p>
                </div>
                <div
                    onClick={() => router.push("/viewHostelCommitteMembers")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Hostel Committee Members</h3>
                    <p className="text-gray-300">View Hostel Committee Members</p>
                </div>
                <div
                    onClick={() => router.push("/removeCommitteMembers")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Remove Hostel Committee Members</h3>
                    <p className="text-gray-300">Remove Hostel Committee Members</p>
                </div>
                <div
                    onClick={() => router.push("/addHostelCommitteMembers")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Add Hostel Committee Members</h3>
                    <p className="text-gray-300">Add Hostel Committee Members</p>
                </div>
                <div
                    onClick={() => router.push("/seeStaff")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">View Staff Members</h3>
                    <p className="text-gray-300">View Staff Members</p>
                </div>
                <div
                    onClick={() => router.push("/addStaff")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">Add Staff Members</h3>
                    <p className="text-gray-300">Add Staff Members</p>
                </div>
                <div
                    onClick={() => router.push("/makeAnnouncements")}
                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">make all Announcements</h3>
                    <p className="text-gray-300">Announcement section</p>
                </div>
                <div
                    onClick={() => router.push("/getAllannouncements")}

                    className="p-6 bg-gray-700 rounded-lg shadow cursor-pointer hover:bg-gray-600 transition text-center"
                >
                    <h3 className="text-lg font-bold">see Announcements</h3>
                    <p className="text-gray-300">Announcement section</p>
                </div>
            </div>
        </div>
    );
} 