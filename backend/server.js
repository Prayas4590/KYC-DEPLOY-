// server.js Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js"; // Ensure routes.js uses ES module syntax
import twilioRoutes from "./twilio.js"; // adjust the path if necessary

dotenv.config(); // Load variables from .env
const app = express();
app.use(express.json()); // <- REQUIRED to parse JSON body

// --- Middleware ---
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',  // From .env or default
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// --- Health check route ---
app.get("/", (req, res) => {
  res.send("Vault KYC backend is running.");
});

// --- API Routes ---
app.use("/api", routes);

// --- MongoDB Connect ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// (Optional) Graceful shutdown - for larger apps
// process.on('SIGINT', async () => {
//   await mongoose.disconnect();
//   process.exit(0);
// });
