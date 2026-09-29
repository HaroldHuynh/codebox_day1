const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserProperty,
} = require("../services/userService");

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body ?? {};
  // Keep the public API camelCase while explicitly mapping to the database's
  // snake_case columns in createUser(). Accept snake_case too for API clients.
  const firstName = body.firstName ?? body.first_name;
  const lastName = body.lastName ?? body.last_name;
  const { email, password } = body;

  if (
    typeof firstName !== "string" || typeof lastName !== "string" ||
    typeof email !== "string" || typeof password !== "string" ||
    !firstName.trim() ||
    !lastName.trim() || !email.trim() || !password
  ) {
    return res.status(400).json({ error: "firstName, lastName, email, and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const newUser = await createUser({
      firstName: firstName.trim(), lastName: lastName.trim(),
      email: email.trim().toLowerCase(), password,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return res.status(409).json({ error: "An account with that email already exists" });
    }
    return res.status(500).json({ error: error.message });
  }
});

/*
router.post("/", (req, res) => {
  const { name, email, isActive, age, hobbies } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof isActive !== "boolean" ||
    typeof age !== "number" ||
    !Array.isArray(hobbies)
  ) {
    return res.status(400).json({
      error: "name, email, isActive, age, and hobbies are required",
    });
  }

  const newUser = createUser({ name, email, isActive, age, hobbies });
  return res.status(201).json(newUser);
}); */

/*
router.get("/", (req, res) => {
  res.status(200).json(getUsers());
}); */

router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

function createPropertyUpdateRoute(property, isValid) {
  router.patch(`/:id/${property}`, (req, res) => {
    const value = req.body?.[property];

    if (!isValid(value)) {
      return res.status(400).json({
        error: `${property} has an invalid value`,
      });
    }

    const updatedUser = updateUserProperty(req.params.id, property, value);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  });
}

createPropertyUpdateRoute("name", (value) => typeof value === "string");
createPropertyUpdateRoute("email", (value) => typeof value === "string");
createPropertyUpdateRoute("isActive", (value) => typeof value === "boolean");
createPropertyUpdateRoute("age", (value) => typeof value === "number");
createPropertyUpdateRoute("hobbies", (value) => Array.isArray(value));

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user);
});

router.get("/:id/name", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.name);
});

router.get("/:id/email", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.email);
});

router.get("/:id/isActive", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.isActive);
});

router.get("/:id/age", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.age);
});

router.get("/:id/hobbies", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.hobbies);
});

router.delete("/:id", (req, res) => {
  const deleted = deleteUserById(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(204).send();
});

module.exports = router;
