// AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const quickLinks = [
    { name: "Invite Users", path: "/invite" },
    { name: "User Logs", path: "/userlogs" },
    { name: "Pending Invitations", path: "/PendingInvitation" },
    { name: "Approval Logs", path: "/approvallogs" },
    { name: "Customisation", path: "/customisation" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar/>

      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {quickLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center flex flex-col justify-center items-center"
            >
              <span className="text-xl font-semibold mb-2">{link.name}</span>
              <span className="text-gray-500">Go to {link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
