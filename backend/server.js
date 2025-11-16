import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});



// import { config } from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get current directory (for ES modules)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load .env with absolute path FIRST
// const envPath = path.resolve(__dirname, "./config/config.env");
// console.log("🔍 Loading .env from:", envPath);

// const result = config({
//   path: envPath,
// });

// if (result.error) {
//   console.error("❌ Error loading .env file:", result.error.message);
//   process.exit(1);
// }

// console.log("✅ .env file loaded successfully");

// // Debug environment variables
// console.log("\n📋 Environment Variables Check:");
// console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
// console.log("STRIPE_PUBLIC_KEY:", process.env.STRIPE_PUBLIC_KEY ? "✅ Loaded" : "❌ Missing");
// console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
// console.log("PORT:", process.env.PORT ? "✅ Loaded" : "❌ Missing");

// if (!process.env.STRIPE_SECRET_KEY) {
//   console.error("\n❌ CRITICAL: STRIPE_SECRET_KEY is missing from config/config.env!");
//   process.exit(1);
// }

// console.log("\n✅ All critical variables loaded\n");

// // NOW import app AFTER .env is loaded
// import app from "./app.js";
// import cloudinary from "cloudinary";
// import { connection } from "./database/connection.js";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// console.log("🎨 Cloudinary configured");

// await connection();
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server listening on http://localhost:${PORT}`);
// });

