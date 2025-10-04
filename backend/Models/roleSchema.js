const mongoose = require('../Configurations/mongoose_config');

const roleSchema = mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  role_name: { type: String, required: true },
  permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
