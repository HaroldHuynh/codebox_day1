require("dotenv").config({ quiet: true });

const express = require("express");
const authenticateToken = require("./middleware/auth");
const usersRouter = require("./routes/users");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add it to your local .env file.");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Goodies API is running" });
});

app.use("/api/users", usersRouter);

app.get("/api/me", authenticateToken, (req, res) => {
  res.status(200).json({ id: 1, name: "Alex" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
