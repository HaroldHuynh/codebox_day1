const users = require("../data/users");
const supabase = require("../config/database");

/*
function getUsers() {
  return users;
}
  */

async function getUsers() {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    throw error;
  }

  return data;
}

function getUserById(id) {
  return users.find((user) => user.id === Number(id));
}

function deleteUserById(id) {
  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return false;
  }

  users.splice(userIndex, 1);
  return true;
}
/*
function createUser(userData) {
  const nextId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
  const newUser = { id: nextId, ...userData };

  users.push(newUser);
  return newUser;
} */

function updateUserProperty(id, property, value) {
  const user = getUserById(id);

  if (!user) {
    return null;
  }

  user[property] = value;
  return user;
}

async function createUser(userData) {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserProperty,
};
