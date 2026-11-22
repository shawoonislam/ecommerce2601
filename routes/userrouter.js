const express = require('express');
const { userController } = require('../controllers/userController');
const _ = express.Router();
const { getAllProduct,getSingleProduct } = require('../controllers/productController');
const {  getAllCategory,getAllSubCategory,getAllCategoryWiseSubCategory,getAllOwnerWiseCategory } = require('../controllers/vendorController');
const { createCart, increDecre,getCart } = require('../controllers/cartController');
const { paymentController, paymentVerify, reOrder } = require('../controllers/paymentController');


_.get('/alluser',userController)


_.get('/all/category',getAllCategory)
_.get('/all/subcategory',getAllSubCategory)
_.get('/all/category/:id/subcategory',getAllCategoryWiseSubCategory)
_.get('/all/user/:id/category',getAllOwnerWiseCategory)

_.get('/all/product',getAllProduct)
_.get('/single/product/:slug',getSingleProduct)


_.post('/create/cart', createCart)
_.post('/cart/incredecre', increDecre)
_.get('/get/cart', getCart)


_.post('/payment',paymentController)
_.post('/reorder',reOrder)
_.get('/payment/verify/:id/:owner',paymentVerify)






module.exports = _