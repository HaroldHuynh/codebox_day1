const authClient = require("../config/authClient");

async function authenticateToken(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization && authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await authClient.auth.getUser(match[1]);

  if (error || !data.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.auth = data.user;
  return next();
}

module.exports = authenticateToken;
