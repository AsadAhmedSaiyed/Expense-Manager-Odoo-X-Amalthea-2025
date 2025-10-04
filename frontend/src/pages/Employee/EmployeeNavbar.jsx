// EmployeeNavbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const EmployeeNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded hover:bg-gray-200 transition ${
      isActive ? "bg-gray-300 font-semibold" : ""
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/home")}>
        Expense Management
      </div>

      <div className="space-x-4 flex items-center">
        <NavLink to="/employee-dashboard" className={linkClass}>
          DashBoard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
        <NavLink to="/expense" className={linkClass}>
          Submit Expense
        </NavLink>
        <NavLink to="/myexpenses" className={linkClass}>
          My Expenses
        </NavLink>
        <NavLink to="/pendingapprovals" className={linkClass}>
          Pending Approvals
        </NavLink>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
