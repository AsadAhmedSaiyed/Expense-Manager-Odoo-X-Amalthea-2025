import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Invite = () => {
  const [rows, setRows] = useState([]);
  const [log, setLog] = useState([]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), username: "", role: "", email: "" }]);
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const sendPassword = async (row) => {
    if (!row.username || !row.role || !row.email) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch("/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      const result = await res.json();
      console.log(result);

      // Move row to log
      setLog([...log, row]);
      // Remove from rows
      setRows(rows.filter((r) => r.id !== row.id));
    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Invite Users</h2>

        <button
          onClick={addRow}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New +
        </button>

        <table className="w-full bg-white border rounded shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={row.username}
                    onChange={(e) =>
                      handleChange(row.id, "username", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) =>
                      handleChange(row.id, "role", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) =>
                      handleChange(row.id, "email", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:outline-none"
                  />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => sendPassword(row)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Send Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {log.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Invitation Log</h3>
            <table className="w-full bg-white border rounded shadow overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {log.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{row.username}</td>
                    <td className="p-2 border">{row.role}</td>
                    <td className="p-2 border">{row.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Invite;
