// UserLogs.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Footer from "../../components/Footer";

const UserLogs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const response = await fetch("http://localhost:3000/user-logs", {
          method: "GET",
          credentials: "include", // ✅ send JWT cookie
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user logs");
        }

        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLogs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Logs</h2>

        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">
                  Employee ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-4 py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.employee_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {user.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.updated_at).toLocaleString()}
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

export default UserLogs;
