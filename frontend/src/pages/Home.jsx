// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">💸 Expense Management System</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/employee-login")}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Employee Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto p-6 space-y-10 text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Expense Management System
        </h2>
        <p className="text-lg text-gray-700">
          Our product simplifies the way companies manage employee expenses.
        </p>

        <section className="bg-white p-6 rounded shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">What is this product?</h3>
          <p className="text-gray-600">
            It is a smart, automated expense management system that allows employees to submit expenses easily,
            and enables managers and admins to approve, track, and manage them efficiently.
          </p>
        </section>

        <section className="bg-white p-6 rounded shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Key Benefits</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Faster expense submission and approval</li>
            <li>Clear visibility for employees and managers</li>
            <li>Automated multi-level approval workflow</li>
            <li>Secure and centralized record of all expenses</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Get Started</h3>
          <p className="text-gray-600">
            Choose your role and login or register to begin using the system.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/employee-login")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Employee Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Register
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center">
        &copy; 2025 Expense Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
