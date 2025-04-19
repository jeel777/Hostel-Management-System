'use client';
import React, { useState } from 'react';

const MakeAnnouncementForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      setForm({ title: '', description: '', date: '' });
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Announcement</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="input-group mb-4">
          <label className="block text-lg mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter the title"
            required
            className="w-full p-3 bg-gray-700 text-white rounded-md"
          />
        </div>

        <div className="input-group mb-4">
          <label className="block text-lg mb-2">Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter the description"
            required
            className="w-full p-3 bg-gray-700 text-white rounded-md"
          />
        </div>

        <div className="input-group mb-6">
          <label className="block text-lg mb-2">Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 text-white rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          {loading ? 'Creating...' : 'Create Announcement'}
        </button>
      </form>

      {message && <p className="text-center mt-4 text-red-400">{message}</p>}
    </div>
  );
};

export default MakeAnnouncementForm;
