// PendingApprovals.jsx
import React, { useEffect, useState } from "react";

const PendingApprovals = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending expenses
  const fetchPending = async () => {
    try {
      const response = await fetch("http://localhost:3000/pending-approvals", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch pending approvals");
      setExpenses(data.expenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Approve or reject an expense
  const handleApproval = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/expenses/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comments: "" }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update expense");

      // Update the state locally
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? { ...exp, status: data.expense.status } : exp))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pending Approvals</h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No pending approvals at the moment.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Currency</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Submitted By</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.currency}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.category}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.description || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{exp.submitted_by.name || exp.submitted_by.email}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{exp.status}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    onClick={() => handleApproval(exp._id, "approved")}
                    disabled={exp.status !== "pending"}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleApproval(exp._id, "rejected")}
                    disabled={exp.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingApprovals;
