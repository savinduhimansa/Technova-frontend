import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/feedback');
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const normalize = (s) => (s || '').toString().toLowerCase();

  const filtered = useMemo(() => {
    return feedbacks.filter(fb => {
      const q = normalize(search);
      const matches =
        !q ||
        normalize(fb.email).includes(q) ||
        normalize(fb.name).includes(q) ||
        normalize(fb.comments).includes(q);
      const ratingOk = !minRating || Number(fb.serviceRating) >= Number(minRating);
      return matches && ratingOk;
    });
  }, [feedbacks, search, minRating]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const dist = {1:0,2:0,3:0,4:0,5:0};
    let sum = 0;
    filtered.forEach(f => { dist[f.serviceRating]++; sum += f.serviceRating; });
    return {
      total,
      avg: total ? (sum/total).toFixed(2) : 0,
      dist
    };
  }, [filtered]);

  const exportCSV = () => {
    if (!filtered.length) { toast('No feedbacks to export'); return; }
    const header = ['Email','Name','Rating','Comments','Created At'];
    const rows = filtered.map(f => [
      f.email, f.name || 'Anonymous', f.serviceRating, f.comments,
      f.createdAt ? new Date(f.createdAt).toLocaleString() : ''
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-report-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-feedback-container min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <h2 className="text-2xl font-bold text-fuchsia-400 drop-shadow-[0_0_10px_#f0f] mb-6">
        Feedback Management
      </h2>

      <div className="filters flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by email, name or comments"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg bg-gray-900 border border-cyan-400 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
        />
        <select
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          className="rounded-lg bg-gray-900 border border-cyan-400 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
        >
          <option value="">All ratings</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5 only</option>
        </select>
        <button
          onClick={fetchFeedbacks}
          className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 text-sm font-bold shadow-[0_0_12px_rgba(255,0,255,0.5)] hover:scale-105 transition-transform"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button
          onClick={exportCSV}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-4 py-2 text-sm font-bold shadow-[0_0_12px_rgba(0,255,255,0.6)] hover:scale-105 transition-transform"
        >
          Export CSV
        </button>
      </div>

      <div className="stats-bar flex flex-wrap gap-6 mb-6 text-sm text-cyan-300">
        <span>Total: <b className="text-white">{stats.total}</b></span>
        <span>Average Rating: <b className="text-white">{stats.avg}</b></span>
        <span>
          5★: {stats.dist[5]} | 4★: {stats.dist[4]} | 3★: {stats.dist[3]} | 2★: {stats.dist[2]} | 1★: {stats.dist[1]}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-fuchsia-600 shadow-[0_0_15px_rgba(255,0,255,0.5)]">
        <table className="feedback-table w-full text-sm text-left">
          <thead className="bg-gray-800 text-fuchsia-400">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Comments</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                <td className="px-4 py-2">{f.email}</td>
                <td className="px-4 py-2">{f.name || 'Anonymous'}</td>
                <td className="px-4 py-2 text-cyan-300">{f.serviceRating}</td>
                <td className="px-4 py-2">{f.comments}</td>
                <td className="px-4 py-2">{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="5" className="no-feedback px-4 py-6 text-center text-gray-400">
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
