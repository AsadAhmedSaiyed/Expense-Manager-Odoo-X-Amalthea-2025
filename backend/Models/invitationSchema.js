const mongoose = require('../Configurations/mongoose_config');

const invitationSchema = mongoose.Schema(
  {
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    email: { type: String, required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // <-- updated
    generated_password: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    sent_at: { type: Date, default: Date.now },
    accepted_at: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", invitationSchema);
