const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/ComplaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch((err) => {
    console.error("MongoDB Connection Error ❌:", err);
    process.exit(1);
  });
