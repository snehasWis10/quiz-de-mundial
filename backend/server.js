const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// 🔴 THESE TWO MUST COME BEFORE ROUTES
app.use(cors());
app.use(express.json()); // <-- THIS IS THE FIX

// Connect DB
connectDB();

// Routes
app.use("/api/scores", require("./routes/scoreRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
