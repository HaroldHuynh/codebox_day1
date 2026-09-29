const users = require("../data/users");
const supabase = require("../config/database");
const authClient = require("../config/authClient");

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

async function createUser({ firstName, lastName, email, password }) {
  // signUp() creates the Auth user and asks Supabase to send the configured
  // confirmation email. admin.createUser() creates users but does not send it.
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName },
      emailRedirectTo: `${process.env.FRONTEND_URL || "http://localhost:3001"}/auth/confirmed`,
    },
  });

  if (authError) throw authError;

  if (!authData.user) {
    const error = new Error("Unable to create account");
    error.code = "signup_failed";
    throw error;
  }

  // Supabase can return an existing confirmed user without a useful error.
  // Treat that case as a duplicate and never modify or delete that account.
  if (!authData.user.identities?.length) {
    const error = new Error("An account with that email already exists");
    error.code = "email_exists";
    throw error;
  }

  const profileRow = {
    id: authData.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
  };

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .insert([profileRow])
    .select()
    .single();

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw profileError;
  }

  return profile;
}

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserProperty,
};
