// PendingInvitation.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Footer from "../../components/Footer";

const PendingInvitation = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending invitations
  const fetchPendingInvitations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/pending-invitations",
        {
          method: "GET",
          credentials: "include", // send cookies for auth
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch pending invitations");

      setInvitations(data.invitations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Pending Invitations
        </h2>

        {invitations.length === 0 ? (
          <p className="text-center text-gray-500">
            No pending invitations at the moment.
          </p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Sent At</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.role_name || inv.role_id?.role_name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(inv.sent_at).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {inv.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                      Resend
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PendingInvitation;
