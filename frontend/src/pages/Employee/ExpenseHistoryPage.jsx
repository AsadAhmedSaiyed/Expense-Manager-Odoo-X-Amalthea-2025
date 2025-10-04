import { useEffect, useState } from "react";
import ExpenseList from "../../components/ExpenseList";
import EmployeeNavbar from "./EmployeeNavbar";
import Footer from "../../components/Footer";
const ExpenseHistoryPage = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(data);
    };
    fetchExpenses();
  }, []);

  return (
    <div>
      <EmployeeNavbar/>
      <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Expense History</h2>
      <ExpenseList expenses={expenses} />
    </div>
      <Footer/>
    </div>
    
  );
};

export default ExpenseHistoryPage;
