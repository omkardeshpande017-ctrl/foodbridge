// Vercel serverless entry for the FoodBridge API.
//
// The whole Express app lives in ../backend/src/server.js and is exported there,
// so the same code runs locally (`npm run dev`) and on Vercel at /api/*.
//
// Env vars (Project -> Settings -> Environment Variables):
//   DEMO_MODE=1   in-memory data, no database needed (default here)
//   MONGO_URI     use MongoDB Atlas instead
//   JWT_SECRET    long random string
//   CLIENT_URL    frontend origin(s), comma separated
process.env.VERCEL = process.env.VERCEL || '1';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'foodbridge_demo_secret_change_me_32chars';
}

// The server module loads dotenv/config first, which would overwrite anything
// set above from a local .env file. So we import it, then force demo mode.
// Set the flag BEFORE the server module is evaluated. Because ES module
// imports are hoisted, we cannot use a static import here — a dynamic import
// after these assignments is the only reliable order.
process.env.DEMO_MODE = '1';
delete process.env.MONGO_URI;

const { default: app } = await import('../backend/src/server.js');

export default app;
