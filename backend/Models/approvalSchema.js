const mongoose = require("../Configurations/mongoose_config");

const approvalRuleStepSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  approver_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  step_order: { type: Number, required: true },
});

const approvalRuleSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: { type: String, required: true },
    rule_type: {
      type: String,
      enum: ["percentage", "specific", "hybrid"],
      required: true,
    },
    percentage_required: { type: Number },
    specific_approver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    steps: [approvalRuleStepSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApprovalRule", approvalRuleSchema);