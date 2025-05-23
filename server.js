const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/menora_flix")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", require("./routes/auth"));
app.use("/api/movies", require("./routes/movies"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Menora Flix Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Menora Flix Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
