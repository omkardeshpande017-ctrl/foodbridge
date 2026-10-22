import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.users()
      .then(setUsers)
      .catch((err) => setError(err.message || 'Could not load users'))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(u) {
    const status =
      u.status === 'active'
        ? 'suspended'
        : 'active';

    try {
      const updated = await api.userStatus(u._id, status);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, status: updated.status } : x)));
    } catch (err) {
      setError(err.message || 'Could not update the user');
    }
  }

  return (
    <Layout>
      <PageHeader
        title="User Management"
        subtitle="Monitor donors, NGOs, volunteers and administrators."
      />

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="card p-6 text-slate-500">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="card p-6 text-slate-500">No users found.</div>
      ) : (
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr className="border-t" key={u._id}>
                <td className="p-4 font-bold">
                  {u.name}
                </td>

                <td className="p-4">
                  {u.email}
                </td>

                <td className="p-4 capitalize">
                  {u.role}
                </td>

                <td className="p-4">
                  <span
                    className={`status ${
                      u.status === 'active'
                        ? 'status-delivered'
                        : 'status-cancelled'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    disabled={u.role === 'admin'}
                    className="btn btn-secondary text-xs"
                    onClick={() => toggle(u)}
                  >
                    {u.status === 'active'
                      ? 'Suspend'
                      : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </Layout>
  );
}