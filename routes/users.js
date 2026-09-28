const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserProperty,
} = require("../services/userService");

const router = express.Router();

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
});

router.get("/", (req, res) => {
  res.status(200).json(getUsers());
});

function createPropertyUpdateRoute(property, isValid) {
  router.patch(`/:id/${property}`, (req, res) => {
    const value = req.body?.[property];

    if (!isValid(value)) {
      return res.status(400).json({
        error: `${property} has an invalid value`,
      });
    }

    const updatedUser = updateUserProperty(
      req.params.id,
      property,
      value
    );

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
