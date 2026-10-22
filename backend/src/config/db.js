import mongoose from 'mongoose';

export async function connectDB() {
  // On Vercel there is no local MongoDB: never fall back to localhost there,
  // otherwise every request waits ~10s to time out.
  const fallback = process.env.VERCEL
    ? null
    : 'mongodb://127.0.0.1:27017/foodbridge';
  const uri = process.env.MONGO_URI || fallback;

  if (!uri) {
    console.warn('MongoDB unavailable: no MONGO_URI configured');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    return true;
  } catch (e) {
    console.warn('MongoDB unavailable:', e.message);
    return false;
  }
}