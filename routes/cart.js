const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const { isLoggedIn, isAdmin } = require('../middleware/auth')

module.exports = (app) => {
  app.use('/api/cart', isLoggedIn, router)
  router.get('/', cartController.getUsersCart)
  router.put('/', cartController.editProductInCart)
  router.delete('/', cartController.deleteProductInCart)
  router.post('/add', cartController.addProductToCart)
  router.get('/admin', isAdmin, cartController.getCarts)
  router.post('/checkout', isLoggedIn, cartController.checkout)
}
