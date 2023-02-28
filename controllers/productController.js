const productModel = require("../models/product");

const getProducts = async (req, res, next) => {
  const queryOpts = req.query;

  try {
    const response = await productModel.getProducts(queryOpts);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const response = await productModel.getProductById(id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const newData = req.body;
    const id = parseInt(req.params.id);
    const response = await productModel.updateProductById(id, newData);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await productModel.deleteProductById(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await productModel.addProduct(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addProduct,
};
