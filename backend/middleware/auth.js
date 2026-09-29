const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization && authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.auth = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateToken;
