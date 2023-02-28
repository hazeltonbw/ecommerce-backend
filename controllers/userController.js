const userModel = require("../models/user");
const cartModel = require("../models/cart");

const getUsers = async (req, res, next) => {
  try {
    const response = await userModel.getUsers();
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const response = await userModel.getUserById(id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const updateUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { password } = req.body;
  const user = { id, password };

  try {
    const response = await userModel.updateUserPassword(user);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params; //user_id
    const { cart_id } = req.user;
    // delete references to user so theres no conflicts in database
    const deleteCart = await cartModel.deleteUsersCart(cart_id);
    const response = await userModel.deleteUserById(id);
    res.status(200).send({
      message: `User with userId: ${id} deleted from database.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
