import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import groupRoutes from "./routes/groups";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use("/groups", groupRoutes);
app.use("/users", userRoutes);


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

app.post("/debug", (req, res) => {
    console.log("Body received:", req.body);
    res.json({ received: req.body });
  });
  

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
