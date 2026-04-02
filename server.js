// server.js
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } =pkg;
const app = express();


  const pool = new Pool({
  host: process.env.DB_HOST,   
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  });

  const connectWithRetry = async () => {
  let retries = 5;

  while (retries) {
    try {
      const client = await pool.connect();
      console.log("✅ Connected to PostgreSQL");
      client.release();
      return;
    } catch (err) {
      console.log("⏳ DB not ready, retrying...", retries);
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("❌ Could not connect to DB after retries");
};

connectWithRetry();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "final check bina down kiye chal raha hai ki nahi new updaye reflect ho rahe hai  ",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});