import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import routes from "./routes";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import paymentsRouter from "./routes/payments";
import multer from "multer";

// Load environment variables
dotenv.config();

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

// Database configuration
const dbConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }, // Required for services like Neon, Render, etc.
      }
    : { database: process.env.DB_NAME }; // Simplified local config

export const pool = new Pool(dbConfig);

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
