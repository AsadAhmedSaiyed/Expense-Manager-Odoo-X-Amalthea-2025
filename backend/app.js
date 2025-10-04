require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Models
const Company = require("./Models/companySchema");
const User = require("./Models/userSchema");
const Role = require("./Models/roleSchema");
const Invitation = require("./Models/invitationSchema");
const Expense = require("./Models/expenseSchema");
const ApprovalRule = require("./Models/approvalRuleSchema");

// Utils
const generatePassword = require("./utils/generatePassword");
const getCurrencyByCountry = require("./utils/getCurrency");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));

// ---------------- Middleware ----------------
const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------- Auth Routes ----------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, country } = req.body;
    if (!name || !email || !password || !confirmPassword || !country)
      return res.status(400).json({ message: "All fields are required" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const currency = await getCurrencyByCountry(country);

    const company = await Company.create({
      company_name: name + " Company",
      country,
      currency,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    let adminRole = await Role.findOne({ company_id: company._id, role_name: "Admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        company_id: company._id,
        role_name: "Admin",
        permissions: { allAccess: true },
      });
    }

    const user = await User.create({
      company_id: company._id,
      role_id: adminRole._id,
      name,
      email,
      employee_id: "EMP001",
      password_hash: hashedPassword,
      status: "active",
    });

    res.status(201).json({
      message: "Company and Admin registered successfully",
      company,
      user: { name: user.name, email: user.email, role: adminRole.role_name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).populate("role_id");
    if (!user) {
      const invite = await Invitation.findOne({ email, status: "pending" });
      if (invite) return res.status(403).json({ message: "Pending invitation. Accept first." });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") return res.status(403).json({ message: "User not active" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      company_id: user.company_id,
      role: user.role_id.role_name,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 24*60*60*1000 });
    res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role_id.role_name, permissions: user.role_id.permissions } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- Invitation Routes ----------------
app.post("/invite", isLoggedIn, async (req, res) => {
  try {
    const { name, email, roleName } = req.body;
    const adminUser = await User.findById(req.user.id);

    if (!name || !email || !roleName) return res.status(400).json({ message: "All fields are required" });

    const role = await Role.findOne({ company_id: adminUser.company_id, role_name: roleName });
    if (!role) return res.status(404).json({ message: "Role not found" });

    const tempPassword = generatePassword(10);

    const invitation = await Invitation.create({
      company_id: adminUser.company_id,
      email,
      role_id: role._id,
      generated_password: tempPassword,
      status: "pending",
      sent_at: new Date(),
    });

    const oAuth2Client = new google.auth.OAuth2(
      process.env.EMAIL_CLIENT_ID,
      process.env.EMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You are invited!",
      text: `Hello ${name},\n\nYou have been invited to join the company. Your temporary password is: ${tempPassword}\nPlease login and change your password.\n\nThanks!`,
    });

    res.status(200).json({ message: "Invitation sent successfully via OAuth2", invitation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/accept-invite", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) return res.status(400).json({ message: "All fields are required" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const invitation = await Invitation.findOne({ email, status: "pending" });
    if (!invitation) return res.status(404).json({ message: "Invitation not found or accepted" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      company_id: invitation.company_id,
      role_id: invitation.role_id,
      name,
      email,
      employee_id: "EMP" + Math.floor(Math.random() * 10000),
      password_hash: hashedPassword,
      status: "active",
    });

    invitation.status = "accepted";
    invitation.accepted_at = new Date();
    await invitation.save();

    res.status(201).json({ message: "Invitation accepted. User created.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- Logout & Dashboard ----------------


app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.get("/dashboard", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user.id).populate("role_id");
  res.json({ message: "Welcome!", user: { name: user.name, email: user.email, role: user.role_id.role_name, permissions: user.role_id.permissions } });
});

// Get all users (User Logs) for the company
app.get("/user-logs", isLoggedIn, async (req, res) => {
  try {
    // Only allow admins to fetch user logs
    const currentUser = await User.findById(req.user.id).populate("role_id");
    // if (!currentUser.role_id.allAccess) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    // Fetch all users of the same company
    const users = await User.find({ company_id: req.user.company_id })
      .populate("role_id", "role_name permissions")
      .select("name email employee_id status createdAt updatedAt role_id");

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      employee_id: user.employee_id,
      status: user.status,
      role: user.role_id.role_name,
      permissions: user.role_id.permissions,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }));

    res.json({ users: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ---------------- Expenses Routes ----------------
app.post("/expenses", isLoggedIn, async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;
    if (!amount || !currency || !category || !date) return res.status(400).json({ message: "All fields except description are required" });

    const expense = await Expense.create({
      company_id: req.user.company_id,
      submitted_by: req.user.id,
      amount,
      currency,
      category,
      description,
      date,
      status: "pending",
    });

    res.status(201).json({ message: "Expense submitted", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/my-expenses", isLoggedIn, async (req, res) => {
  try {
    const expenses = await Expense.find({ submitted_by: req.user.id });
    res.json({ expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/expenses/:id/approve", isLoggedIn, async (req, res) => {
  try {
    const { status, comments } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const approver = await User.findById(req.user.id);
    if (approver.company_id.toString() !== expense.company_id.toString())
      return res.status(403).json({ message: "Not allowed" });

    expense.approval_steps.push({
      approver_id: req.user.id,
      step_order: expense.approval_steps.length + 1,
      status,
      comments,
    });

    if (status === "approved") expense.status = "approved";
    else if (status === "rejected") expense.status = "rejected";

    await expense.save();
    res.json({ message: `Expense ${status}`, expense });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/pending-approvals", isLoggedIn, async (req, res) => {
  try {
    const expenses = await Expense.find({
      company_id: req.user.company_id,
      status: "pending",
      "approval_steps.approver_id": { $ne: req.user.id },
    });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- Start Server ----------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
