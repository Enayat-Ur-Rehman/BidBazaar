import mongoose from "mongoose";

// With several app containers behind the load balancer, each one schedules the same cron.
// A short-lived lock document in MongoDB makes sure only one container runs a job per tick.
export const runExclusive = async (name, ttlMs, task) => {
  const now = new Date();
  try {
    await mongoose.connection.collection("cronlocks").updateOne(
      { _id: name, lockedUntil: { $lte: now } },
      { $set: { lockedUntil: new Date(now.getTime() + ttlMs) } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code === 11000) return;
    console.error(`Cron lock error for ${name}:`, error.message);
    return;
  }
  await task();
};
