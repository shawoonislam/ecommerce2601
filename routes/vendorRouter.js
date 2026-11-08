const express = require('express');
const { createCategory, getAllCategory,createSubCategory,getAllSubCategory,getAllCategoryWiseSubCategory,getAllOwnerWiseCategory, } = require('../controllers/vendorController');
const { createProduct, getAllProduct,bulkProductUploadController,updateProductController,getSingleProduct } = require('../controllers/productController');
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



// product
_.post('/create/product', upload.array('photo') ,createProduct)
_.post('/bulk/product', upload.single('file') ,bulkProductUploadController)
_.post('/single/product/upload/:id', upload.array('photo') ,updateProductController)








module.exports = _