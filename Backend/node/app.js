const express = require("express");
const app = express();
const authRoutes = require("./routes/userRoutes");
const connectDB = require("./connectDb/connectDb");
require('dotenv').config();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173" })); 
connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});