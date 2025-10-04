import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">Expense Management</h2>
          <p className="mt-3 text-sm">
            Simplify your expense tracking and approvals with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><Link to="/home" className="hover:text-white">Home</Link></li>
            <li><Link to="/invite" className="hover:text-white">Invite</Link></li>
            <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
            <li><Link to="/userlogs" className="hover:text-white">User Logs</Link></li>
            <li><Link to="/approvallogs" className="hover:text-white">Approval Logs</Link></li>
          </ul>
        </div>

        {/* Company / Policies */}
        <div>
          <h3 className="text-lg font-semibold text-white">Company</h3>
          <ul className="mt-3 space-y-2">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Expense Management. All rights reserved.</p>
        
        {/* Social Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white"><Facebook size={20} /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white"><Twitter size={20} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white"><Linkedin size={20} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white"><Github size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
