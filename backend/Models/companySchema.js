const mongoose = require('../Configurations/mongoose_config');

const companySchema = mongoose.Schema({
  company_name: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
