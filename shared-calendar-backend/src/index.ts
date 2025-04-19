import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Shared Calendar API is running!");
});

// Example: Create user
app.post("/users", async (req, res) => {
  const { name, email, timezone } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, timezone },
    });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
