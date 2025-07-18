require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const { requireAuth } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
const PORT = process.env.PORT || 5100;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

app.use(morgan("dev")); // Logger
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS: Allow React App
app.use(
  cors({
    origin: true, // Vite default
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", requireAuth, itemRoutes);
app.use("/api/invoices", requireAuth, invoiceRoutes);

process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, "public")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get(/(.*)/, function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// 404 JSON Response
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

startServer();
