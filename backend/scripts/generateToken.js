require("dotenv").config({ quiet: true });

const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add it to your local .env file.");
}

const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, {
  algorithm: "HS256",
  expiresIn: "15m",
});

console.log(token);
