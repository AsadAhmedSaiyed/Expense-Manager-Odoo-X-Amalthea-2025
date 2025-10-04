import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({ expenses }) => {
  if (!expenses.length) {
    return <p className="text-gray-600 text-center">No expenses yet.</p>;
  }

  return (
    <div className="space-y-3">
      {expenses.map((exp) => (
        <ExpenseCard key={exp._id} expense={exp} />
      ))}
    </div>
  );
};

export default ExpenseList;
