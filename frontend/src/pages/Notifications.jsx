import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Bell, Check } from 'lucide-react';

export default function Notifications() {
  const [ns, setNs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .notifications()
      .then(setNs)
      .catch((err) => setError(err.message || 'Could not load notifications'))
      .finally(() => setLoading(false));
  }, []);

  async function read(n) {
    try {
      const updated = await api.readNotification(n._id || n.id);
      setNs((list) =>
        list.map((x) => (x._id === updated._id ? updated : x))
      );
    } catch (err) {
      setError(err.message || 'Could not mark as read');
    }
  }

  return (
    <Layout>
      <PageHeader
        title="Notifications"
        subtitle="Updates from donations, matching and deliveries."
      />

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm max-w-3xl">{error}</div>
      )}

      <div className="max-w-3xl grid gap-3">
        {loading && <div className="card p-6 text-slate-500">Loading notifications…</div>}
        {!loading && ns.length === 0 && (
          <div className="card p-6 text-slate-500">You have no notifications yet.</div>
        )}
        {ns.map(n => (
          <div
            key={n._id || n.id}
            className={`card p-5 flex gap-4 ${
              n.read ? 'opacity-70' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 grid place-items-center shrink-0">
              <Bell size={18} />
            </div>

            <div className="flex-1">
              <b>{n.title}</b>

              <p className="text-sm text-slate-500 mt-1">
                {n.message}
              </p>
            </div>

            {!n.read && (
              <button
                className="btn btn-secondary text-xs"
                onClick={() => read(n)}
              >
                <Check size={15} />
                Read
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}