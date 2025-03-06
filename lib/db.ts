import mongoose from "mongoose";

// The '!' after a variable in TypeScript asserts that this value will never be null or undefined.
const MONGODB_URI = process.env.MONGODB_URI!;

// Ensure MONGODB_URI is defined in environment variables.
if (!MONGODB_URI) {
  throw new Error("Please define Mongodb URI in your environment variables.");
}

let cached = global.mongoose;

// We're trying to access mongoose from the global object in Node.js, but TypeScript complains that its type doesn't exist.
// To resolve this, define its type in `types.d.ts`, which is separate from `next-env.d.ts` (which contains Next.js environment-related types).

// Check if a cached connection exists. If not, initialize it with null values for later use.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // In an edge environment, there might already be an existing database connection. If so, return the existing connection.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection or promise exists, attempt to establish a new connection to the database.
  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    // Create a connection promise and store it.
    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection);
  }

  // Wait for the connection promise to resolve.
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset the promise in case of an error.
    throw error;
  }

  // Return the established connection.
  return cached.conn;
}
