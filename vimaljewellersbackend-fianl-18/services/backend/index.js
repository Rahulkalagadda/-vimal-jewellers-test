import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./upload_file.js";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import winston from "winston";
import productsRouter from "./routers/products.js";
import authRouter from "./routers/auth.js";
import categoriesRouter from "./routers/categories.js";
import collectionsRouter from "./routers/collections.js";
import cartRouter from "./routers/cart.js";
import ordersRouter from "./routers/orders.js";
import usersRouter from "./routers/users.js";
import bannersRouter from "./routers/banners.js";
import homeRouter from "./routers/home.js";
import db from "./db.js";
import megaMenuRouter from "./routers/mega_menu.js";
import wishlistRouter from "./routers/wishlist.js";
import pagesRouter from "./routers/pages.js";
import settingsRouter from "./routers/settings.js";
import appointmentsRouter from "./routers/appointments.js";
import inquiriesRouter from "./routers/inquiries.js";
import footerConfigRouter from "./routers/footer_config.js";

// ... (existing imports)


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

// Rate Limiting (Disabled for stability)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10000, 
// });
// app.use(limiter);



app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: false, // Must be false when origin is "*"
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const imagesPath = path.join(__dirname, "images");

// Explicitly allow cross-origin for images
app.use("/images", (req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(imagesPath));

// API Routes

// API Routers
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api", usersRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/home", homeRouter);
app.use("/api", uploadRoutes);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/pages", pagesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/footer-configs", footerConfigRouter);
app.use("/api/mega-menu", megaMenuRouter);

// Health Check Endpoint
app.get("/health", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ status: 'healthy', database: 'connected', version: process.version });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Vimal Jewellers Backend!");
});

// Fallback Route for undefined routes
app.use((req, res) => {
  res.status(404).send("404: Route not found");
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 7502;

// Ensure all tables are created before starting the server
// Ensure all tables are created before starting the server
// Sync users and home table specifically to apply schema changes
// DB Sync Logic
// In production, we should use migrations. disable 'alter: true' to prevent data loss.
const syncOptions = process.env.NODE_ENV === 'production' ? { alter: false } : { alter: false };

// Global Process Error Handlers for Stability
// Global Process Error Handlers for Stability
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Logging error but keeping process alive...');
  console.error(err.name, err.message, err.stack);
  // process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Logging error but keeping process alive...');
  console.error(err);
  // process.exit(1); // KEEP ALIVE
});

// DB Initialization logic with improved error handling for serverless
const initDb = async () => {
  try {
    console.log("Checking database connection...");
    // Check if we should sync (usually only in dev or once during setup)
    // CRITICAL: DISABLE SYNC IN PRODUCTION TO PREVENT DATA LOSS
    if (process.env.NODE_ENV !== 'production' && process.env.SKIP_DB_SYNC !== 'true') {
      await db.users.sync(syncOptions);
      await db.home.sync(syncOptions);
      await db.globalMaterials.sync(syncOptions);
      await db.sequelize.sync();
      console.log("Database synced successfully.");
    } else {
      console.log("Production environment detected or SKIP_DB_SYNC is true. Skipping database sync.");
      // Use migrations instead
    }

    // Authenticate connection
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

  } catch (err) {
    console.error("CRITICAL: Database initialization failed:", err.message);
    // We don't throw here to allow the app object to be exported, 
    // but actual API calls will fail until the DB is fixed.
  }
};

// Start initialization
initDb();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(port, () => {
    console.log(`🚀 Vimal Jewellers Backend running on port ${port} `);
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
}

export default app;


