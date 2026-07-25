import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express from "express";
import cors from "cors";
import { Pool } from "pg";
import routes from "./routes";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import paymentsRouter from "./routes/payments";
import multer from "multer";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());

// Enable pre-flight requests for all routes
app.options('*', cors());

// Database configuration
const dbConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }, // Required for services like Neon, Render, etc.
      }
    : { database: process.env.DB_NAME }; // Simplified local config

export const pool = new Pool(dbConfig);

// Use routes
app.use("/api", routes);
app.use("/api/auth", authRoutes); // Handles /login, /register, and now /registries/mine
app.use("/api/upload", uploadRoutes);
app.use('/api/payments', paymentsRouter);

// Global error handler for multer errors. This should be placed after the routes.
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading (e.g., file too large).
    res.status(400).json({ error: `File upload error: ${err.message}` });
  } else if (err) {
    // An error from our custom file filter or another middleware.
    res.status(400).json({ error: err.message });
  } else {
    // Pass on to the next error handler if it's not a multer error.
    next(err);
  }
});

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Wedding Gift Registry API" });
});

const startServer = async () => {
  try {
    // Test the database connection by getting a client from the pool
    const client = await pool.connect();
    console.log("Successfully connected to the database.");
    client.release();

    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database. Server will not start.", err);
    process.exit(1); // Exit the process with an error code
  }
};

// Start the application
startServer();
