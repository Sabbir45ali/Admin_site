// Centralized API configuration
// Set VITE_API_BASE_URL in your .env or hosting environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/admin";

// Cloudinary (free image hosting)
export const CLOUDINARY_CLOUD_NAME = "dcijnx34r";
export const CLOUDINARY_UPLOAD_PRESET = "beauty_parlour";
