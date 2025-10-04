import { useState } from "react";

const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    category: "Food",
    description: "",
    date: "",
    receipt: null,
  });

  const categories = ["Travel", "Food", "Office", "Entertainment", "Other"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Submit Expense</h2>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium">Currency</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="block text-sm font-medium">Upload Receipt</label>
        <input
          type="file"
          name="receipt"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition"
      >
        Submit Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
