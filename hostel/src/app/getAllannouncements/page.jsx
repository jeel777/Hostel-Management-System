'use client';
import React, { useState, useEffect } from 'react';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/getallannouncements');
        const data = await res.json();

        if (res.ok) {
          setAnnouncements(data);
        } else {
          setError(data.error || 'Failed to load announcements');
        }
      } catch (err) {
        setError('Server error while fetching announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Announcements</h2>

      {loading && <p className="text-center">Loading announcements...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded shadow-lg">
            <thead className="bg-gray-700 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="p-3">{announcement.title}</td>
                  <td className="p-3">{announcement.description}</td>
                  <td className="p-3">{new Date(announcement.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
