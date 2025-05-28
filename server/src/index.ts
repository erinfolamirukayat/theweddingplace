import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import routes from "./routes";
import authRoutes from "./routes/auth";
import path from "path";
import uploadRoutes from "./routes/upload";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database configuration
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432"),
      }
);

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Successfully connected to database");
  release();
});

// Use routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Wedding Gift Registry API" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
