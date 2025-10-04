const mongoose = require('../Configurations/mongoose_config');

const approvalRuleSchema = mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  rule_type: { type: String, enum: ['percentage', 'specific', 'hybrid'], required: true },
  percentage_required: Number,
  specific_approver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  steps: [
    { 
      role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
      approver_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      step_order: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ApprovalRule', approvalRuleSchema);
