"use client";

import { useState, useEffect } from "react";

export default function FeePayment() {
    const [formData, setFormData] = useState({
        student_id: "",
        semester: "",
        date_of_payment: "",
        transaction_id: "",
        mode_of_payment: "UPI",
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
        const response = await fetch("http://localhost:5000/api/createFeePayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Fee payment recorded successfully!");
            setFormData({ student_id: formData.student_id, semester: "", date_of_payment: "", transaction_id: "", mode_of_payment: "UPI" });
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Fee Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-white cursor-not-allowed"
                />
                <input
                    type="number"
                    name="semester"
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="date"
                    name="date_of_payment"
                    value={formData.date_of_payment}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <input
                    type="text"
                    name="transaction_id"
                    placeholder="Transaction ID"
                    value={formData.transaction_id}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                />
                <select
                    name="mode_of_payment"
                    value={formData.mode_of_payment}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash">Cash</option>
                </select>
                <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
                    Submit Payment
                </button>
            </form>
        </div>
    );
}
