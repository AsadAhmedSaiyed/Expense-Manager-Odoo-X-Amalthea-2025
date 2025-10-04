const ExpenseCard = ({ expense }) => {
  const statusColors = {
    Pending: "bg-yellow-200 text-yellow-800",
    Approved: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{expense.category}</h3>
        <p className="text-sm text-gray-600">{expense.description}</p>
        <p className="text-sm text-gray-500">{new Date(expense.date).toDateString()}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">{expense.amount} {expense.originalCurrency}</p>
        <span
          className={`text-xs px-2 py-1 rounded ${statusColors[expense.status]}`}
        >
          {expense.status}
        </span>
      </div>
    </div>
  );
};

export default ExpenseCard;
