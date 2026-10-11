const express = require('express');
const { createCategory, getAllCategory,createSubCategory,getAllSubCategory,getAllCategoryWiseSubCategory,getAllOwnerWiseCategory } = require('../controllers/vendorController');
const { createProduct, getAllProduct } = require('../controllers/productController');
const _ = express.Router();
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let uniqueName = `eco-${Date.now()}`  
    cb(null, uniqueName + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// category and sub category
_.post('/create/category',createCategory)
_.post('/create/subcategory',createSubCategory)
_.get('/all/category',getAllCategory)
_.get('/all/subcategory',getAllSubCategory)
_.get('/all/category/:id/subcategory',getAllCategoryWiseSubCategory)
_.get('/all/user/:id/category',getAllOwnerWiseCategory)


// product
_.post('/create/product', upload.array('photo') ,createProduct)
_.get('/all/product',getAllProduct)






module.exports = _