import ExpenseForm from "../components/ExpenseForm";

const SubmitExpensePage = () => {
  const handleExpenseSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formDataToSend.append(key, formData[key])
      );

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Expense submitted successfully!");
      } else {
        alert(data.message || "Error submitting expense");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <ExpenseForm onSubmit={handleExpenseSubmit} />
    </div>
  );
};

export default SubmitExpensePage;
