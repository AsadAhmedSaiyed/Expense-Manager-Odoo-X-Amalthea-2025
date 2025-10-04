const mongoose = require('../Configurations/mongoose_config');

const userSchema = mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employee_id: { type: String, required: true },
  password_hash: { type: String, required: true },
  status: { type: String, enum: ['invited', 'active', 'inactive'], default: 'invited' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
