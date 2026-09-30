require("dotenv").config({ quiet: true });

const express = require("express");
const authenticateToken = require("./middleware/auth");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const itemsRouter = require("./routes/items");
const supabase = require("./config/database");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add it to your local .env file.");
}

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const requestOrigin = req.get("origin");
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Goodies API is running" });
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);

app.get("/api/me", authenticateToken, async (req, res) => {
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, created_at")
    .eq("id", req.auth.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load user profile:", profileError.message);
    return res.status(500).json({ error: "Unable to load user profile" });
  }

  if (profile) {
    return res.status(200).json(profile);
  }

  const firstName = req.auth.user_metadata?.firstName || "";
  const lastName = req.auth.user_metadata?.lastName || "";

  if (!firstName || !lastName || !req.auth.email) {
    return res.status(404).json({ error: "User profile not found" });
  }

  const { data: createdProfile, error: createProfileError } = await supabase
    .from("users")
    .insert({
      id: req.auth.id,
      first_name: firstName,
      last_name: lastName,
      email: req.auth.email.toLowerCase(),
    })
    .select("id, first_name, last_name, email, created_at")
    .single();

  if (createProfileError) {
    console.error("Failed to create missing user profile:", createProfileError.message);
    return res.status(500).json({ error: "Unable to create user profile" });
  }

  return res.status(200).json(createdProfile);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
