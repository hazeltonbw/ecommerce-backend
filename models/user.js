const pool = require("../db");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

/**
 * Queries the database for all users
 * @returns An array of all users
 */
const getUsers = async () => {
  const statement = "SELECT * FROM users ORDER BY user_id ASC";
  try {
    const result = await pool.query(statement);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Queries the database for a user that matches an id
 * @param {number} id The users id
 * @returns An object with the users information
 */
const getUserById = async (id) => {
  const query = {
    text: "SELECT user_id, fname, lname, email, isadmin as is_admin FROM users WHERE user_id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Creates a user in the database
 * @param {Object} data Object with email, password properties defined
 * @returns An object with the newly created users information
 */
const createUser = async (data) => {
  const { email, password, fname, lname, isAdmin } = data;
  const hashedPassword = await hashPassword(password);

  const query = {
    text: "INSERT INTO users(password, email, fname, lname, isadmin) VALUES($1, $2, $3, $4, $5) RETURNING *",
    values: [hashedPassword, email, fname, lname, isAdmin],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    //console.error(err);
    throw new Error(err);
  }
};

/**
 * Hashes users password for secure storage in database
 * @param {String} password The users password
 * @returns The hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Updates users password in the database
 * @param {Object} data Object with id, password properties defined
 * @returns An updated object with users information
 */
const updateUserPassword = async (data) => {
  const { id, password } = data;

  // First see if there is a user with the given id.
  try {
    const user = await getUserById(id);
    if (!user) {
      throw createError(400, `No user with id: ${id} found.`);
    }
  } catch (err) {
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  const query = {
    text: "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *",
    values: [hashedPassword, id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

/**
 * Finds a user in the database by email
 * @param {String} email The users email to find
 * @returns An object with the users information
 */
const findUserByEmail = async (email) => {
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    //console.error(err);
    throw err;
  }
};

/**
 * Registers a new user into the database
 * @param {Object} data An object with email property defined
 * @returns An object with the newly created users information
 */
const registerNewUser = async (data) => {
  const { email } = data;
  const user = await findUserByEmail(email);
  if (user) {
    throw createError(409, `User with email: ${email} already exists!`);
  }
  return await createUser(data);
};

/**
 * Verifies user exists in database for login
 * @param {Object} data An object with email, password properties defined
 * @returns An object with the logged in users information
 */
const loginUser = async (data) => {
  const { email, password } = data;
  try {
    // Check if user exists
    const user = await findUserByEmail(email);

    // If no user found, reject
    if (!user) {
      throw createError(401, "Incorrect username or password");
    }

    // Check for matching passwords
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw createError(401, "Incorrect username or password");
    }

    return user;
  } catch (err) {
    //console.error(err, "herhergkerwgkerwgk");
    throw err;
  }
};

/**
 *
 * @param {number} userId The user id to delete
 * @returns x
 */
const deleteUserById = async (userId) => {
  // First check if there is a user with that id
  const user = await getUserById(userId);
  if (!user) {
    throw createError(404, "No user with that id found!");
  }

  const query = {
    text: "DELETE FROM users WHERE user_id = $1",
    values: [userId],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserPassword,
  findUserByEmail,
  registerNewUser,
  loginUser,
  deleteUserById,
};
