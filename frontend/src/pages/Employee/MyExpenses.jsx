// MyExpenses.jsx
import React, { useEffect, useState } from "react";
import EmployeeNavbar from "./EmployeeNavbar";
import Footer from "../../components/Footer";
const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:3000/my-expenses", {
          method: "GET",
          credentials: "include", // ✅ important to send cookies
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch expenses");
        }

        setExpenses(data.expenses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <EmployeeNavbar/>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">My Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses submitted yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Currency</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
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
                <td className="border border-gray-300 px-4 py-2 capitalize">{exp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      <Footer/>
    </div>
    
  );
};

export default MyExpenses;
