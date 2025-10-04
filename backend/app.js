const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
app.use(cookieParser());
require("dotenv").config();
const getCurrencyByCountry = require("./utils/getCurrency");
const generatePassword = require("./utils/generatePassword");
const Company = require("./Models/companySchema");
const Invitation = require("./Models/invitationSchema");
const Role = require("./Models/roleSchema");
const User = require("./Models/userSchema");


const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

//  _______________________________________Middlewares_________________________________


// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token; // cookie name is 'token'

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure to set JWT_SECRET in .env

    // Attach user info to request object
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token, please log in" });
  }
};


//  _______________________________________Post routes_________________________________


app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, country } = req.body;

    if (!name || !email || !password || !confirmPassword || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Get currency dynamically
    const currency = await getCurrencyByCountry(country);

    // Create company
    const company = await Company.create({
      company_name: name + " Company",
      country,
      currency,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin role if not exists
    let adminRole = await Role.findOne({
      company_id: company._id,
      role_name: "Admin",
    });
    if (!adminRole) {
      adminRole = await Role.create({
        company_id: company._id,
        role_name: "Admin",
        permissions: { allAccess: true },
      });
    }

    // Create admin user
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

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user by email and populate role
    const user = await User.findOne({ email }).populate("role_id");

    if (!user) {
      // Check if there is a pending invitation for this email
      const invite = await Invitation.findOne({ email, status: "pending" });
      if (invite) {
        return res.status(403).json({
          message:
            "You have a pending invitation. Please accept the invitation before logging in.",
        });
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(403).json({ message: "User not active. Contact admin." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        company_id: user.company_id,
        role: user.role_id.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return user info
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id.role_name,
        permissions: user.role_id.permissions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/invite", async (req, res) => {
  try {
    const { name, email, roleName } = req.body;
    const adminId = req.user.id; // get admin info from isLoggedIn middleware

    if (!name || !email || !roleName) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    // Find role by name and admin's company
    const adminUser = await User.findById(adminId);
    const role = await Role.findOne({ company_id: adminUser.company_id, role_name: roleName });
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Generate temporary password
    const tempPassword = generatePassword(10);

    // Save invitation
    const invitation = await Invitation.create({
      company_id: adminUser.company_id,
      email,
      role_id: role._id,
      generated_password: tempPassword,
      status: "pending",
      sent_at: new Date(),
    });

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You are invited!",
      text: `Hello ${name},\n\nYou have been invited to join the company. Your temporary password is: ${tempPassword}\nPlease login and change your password.\n\nThanks!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// User accepts invitation and sets password
app.post("/accept-invite", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Find invitation
    const invitation = await Invitation.findOne({ email, status: "pending" });
    if (!invitation) return res.status(404).json({ message: "Invitation not found or already accepted" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      company_id: invitation.company_id,
      role_id: invitation.role_id,
      name: email.split("@")[0], // can ask frontend for name
      email,
      employee_id: "EMP" + Math.floor(Math.random() * 10000), // generate employee id
      password_hash: hashedPassword,
      status: "active",
    });

    // Update invitation status
    invitation.status = "accepted";
    invitation.accepted_at = new Date();
    await invitation.save();

    res.status(201).json({ message: "Invitation accepted. User created.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
