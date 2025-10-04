import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Invite from "./pages/admin/Invite";
import Home from "./pages/Home";
import Profile from "./pages/Employee/Profile";
import Customisation from "./pages/admin/Customisation";

import UserLogs from "./pages/admin/UserLogs";
import Expense from "./pages/Employee/Expense";
import ApprovalLogs from "./pages/admin/ApprovalLogs";
import MyExpenses from "./pages/Employee/MyExpenses";
import PendingApprovals from "./pages/Employee/PendingApprovals";
import PendingInvitation from "./pages/admin/PendingInvitation";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />



        {/* admin */}
        <Route path="/invite" element={<Invite />} />
        <Route path="/customisation" element={<Customisation/>} />
        <Route path="/userlogs" element={<UserLogs/>} />
        <Route path="/approvallogs" element={<ApprovalLogs/>} />
        <Route path="/PendingInvitation" element={<PendingInvitation/>} />



        {/* employee */}
       
        <Route path="/profile" element={<Profile/>} />
        <Route path="/expense" element={<Expense/>} />
        <Route path="/myexpenses" element={<MyExpenses/>} />
        <Route path="/pendingapprovals" element={<PendingApprovals/>} />
        
        
      </Routes>
    </Router>
  );
};

export default App;
