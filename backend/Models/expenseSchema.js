const mongoose = require('../Configurations/mongoose_config');

const expenseSchema = mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approval_steps: [
    {
      approver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      step_order: Number,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      comments: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
