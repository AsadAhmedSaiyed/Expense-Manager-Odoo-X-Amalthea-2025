// Expense.jsx
import React from "react";
import { useForm } from "react-hook-form";

const Expense = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Server error");
      }

      alert(result.message);
      reset();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block mb-1 font-medium">Amount *</label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { required: "Amount is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className="block mb-1 font-medium">Currency *</label>
          <input
            type="text"
            {...register("currency", { required: "Currency is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category *</label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date *</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {isSubmitting ? "Submitting..." : "Submit Expense"}
        </button>
      </form>
    </div>
  );
};

export default Expense;
