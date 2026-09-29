const express = require("express");
const authClient = require("../config/authClient");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const { data, error } = await authClient.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: data.user,
  });
});

router.post("/refresh", async (req, res) => {
  const { refresh_token: refreshToken } = req.body ?? {};

  if (typeof refreshToken !== "string" || !refreshToken) {
    return res.status(400).json({ error: "refresh_token is required" });
  }

  const { data, error } = await authClient.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: data.user,
  });
});

module.exports = router;
