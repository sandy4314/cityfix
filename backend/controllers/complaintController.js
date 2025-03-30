const nodemailer = require("nodemailer");
const Complaint = require('../models/Complaint');
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Set up storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads/" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Multer middleware
const upload = multer({ storage });

const sendEmailNotification = async (userEmail, status) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services as well
    auth: {
      user: process.env.EMAIL_USER, // Sender's email
      pass: process.env.EMAIL_PASS, // Sender's email password
    },
  });

  let info = await transporter.sendMail({
    from: '"City Fix" <your-email@example.com>', // sender address
    to: userEmail, // list of receivers
    subject: `Your Complaint Status Updated to ${status}`, // Subject line
    text: `Your complaint status has been updated to: ${status}. Thank you for using City Fix!`, // plain text body
    html: `<b>Your complaint status has been updated to: ${status}</b><br>Thank you for using City Fix!`, // HTML body
  });

  console.log("Message sent: %s", info.messageId);
};

const createComplaint = async (req, res) => {
  try {
    console.log("🔍 Incoming Complaint Request:", req.body);
    console.log("📸 Uploaded File:", req.file);

    const { issueType, description, priority, address } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Save relative path

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing from token" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComplaint = new Complaint({
      userId: req.user.userId,
      issueType,
      description,
      priority,
      address,
      imagePath, // ✅ Save the image path
    });

    await newComplaint.save();
    console.log("✅ Complaint Saved Successfully:", newComplaint);

    res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (error) {
    console.error("❌ Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateComplaint = async (req, res) => {
  const { complaintId, status } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    // Get user details to send email notification
    const user = await User.findById(complaint.userId);
    if (user && user.email) {
      await sendEmailNotification(user.email, status);
    }

    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId });
    if (complaints.length === 0) {
      return res.status(200).json({ message: "No complaints found" });
    }

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "username mobileNumber address") // Fetch user details
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }

    res.json(complaints);
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createComplaint: [upload.single("image"), createComplaint], getComplaints, updateComplaint, getAllComplaints };
