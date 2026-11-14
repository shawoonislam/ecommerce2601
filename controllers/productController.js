let Product = require("../models/productSchema")
const { readSheet } = require('read-excel-file/node') 
const readXlsxFile = require('read-excel-file/node')

const schema = {
  title: {
    column: 'title',
    type: String
  },
  description: {
    column: 'description',
    type: String
  },
  shortDescription: {
    column: 'shortDescription',
    type: String
  },
  price: {
    column: 'price',
    type: Number
  },
  discountPrice: {
    column: 'discountPrice',
    type: Number
  },
  stock: {
    column: 'stock',
    type: Number
  },
  status: {
    column: 'status',
    type: String
  },
  images: {
    column: 'images.url',
    type: String
  },
  sku: {
    column: 'sku',
    type: String
  },
  slug: {
    column: 'slug',
    type: String
  }
}

let createProduct = async (req,res) =>{
    let {title, description, shortDescription, brand, price,discountType, discountPrice, category, subCategory,isMain,owner,stock} = req.body

    if(discountType && discountPrice){
      if(discountType == 'percent'){
        let afterDiscount = (price * discountPrice) / 100
        if(afterDiscount >= price){
          return res.status(400).json({
            success: false,
            message: "Invalid Discount"
          })
        }
      }else{
        if(discountPrice >= price){
          return res.status(400).json({
            success: false,
            message: "Invalid Discount"
          })
        }
      }
    }

   let images = []
    req.files?.map((item, index) => {
        images.push({
            url: item.path,
            isMain: index == isMain ? true : false
        })
    })

    let slug = title.toLowerCase().split(" ").join("-")

    let existingSlug = await Product.findOne({slug: slug})

    if(existingSlug){
        return res.status(400).json({
            success: false,
            message: "Slug Exists.."
        })
    }

    let sku = `eco-${Date.now()}`
    
    let existingSku = await Product.findOne({sku: sku})

     if(existingSku){
        return res.status(400).json({
            success: false,
            message: "SKU Exists.."
        })
    }

    let product = new Product ({
        title: title, 
        description: description,
        shortDescription: shortDescription,
        price: price,
        discountType:discountType,
        discountPrice: discountPrice,
        category: category,
        subCategory: subCategory,
        slug: slug,
        sku: sku,
        images: images,
        owner: owner,
        stock: stock
    })

    product.save()

    res.status(201).json({
        success: true,
        message: "Product Created",
        product: product
    })

}


// need to update
let getAllProduct = async (req,res) =>{
    let product = await Product.find({}).populate(['category', 'subCategory' , 'owner'])

    res.status(200).json({
        success: true,
        message: "All products",
        product: product
    })


}

let getSingleProduct = async (req,res) =>{

  let {slug} =req.params

    let product = await Product.findOne({slug: slug}).populate(['category', 'subCategory' , 'owner'])

    res.status(200).json({
        success: true,
        message: "Single Products",
        product: product
    })


}

let bulkProductUploadController = async (req,res) => {
    console.log("hello", req.file)
    const { objects, errors } = await readSheet(req.file.path, { schema })


    let products = []

    objects.map((product,index) => {
        products.push({
        ...product,
        slug: product.slug ? product.slug : product.title.toLowerCase().split(" ").join("-"),
        sku: product.sku ? product.sku : `eco-${product.title.substring(0, 4)}-${Date.now()}`,
        images: [
            {
                url: product.images,
                isMain: false
            }
        ]
    })
    })

    await Product.insertMany(products)

    res.status(201).json({
        success: true,
        message: "All product upload done"
    })

}

let updateProductController = async (req,res) => {
    let {id} = req.params

    if(req.body.slug || req.body.sku){
      return res.status(400).json({
        success: false,
        message: "You can not change sku or slug"
      })
    }


    let existingProduct = await Product.findOne({_id: id})

    
    let images = [...existingProduct.images]
  
     req.files.map((item, index) => {
        images.push({
            url: item.path,
            isMain: false
        })
    })

    existingProduct.images = images


    if(req.body.isMain){
      existingProduct.images.map((item,index)=>{
          item.isMain = false
      })
      existingProduct.images[req.body.isMain].isMain = true
      
    }

    // Delete multiple images HW
    if(req.body.deleteImage){
      if(existingProduct.images[req.body.deleteImage].isMain ==  true){
        existingProduct.images[0].isMain = true
      }
      existingProduct.images.splice(req.body.deleteImage, 1);
    }
    
    existingProduct.save()

    

    let data = await Product.findByIdAndUpdate({_id: id},req.body,{new: true})

    res.status(200).json({
      success: true,
      message: "Update Done"
    })

}



// todo: multiple image delete





module.exports = { createProduct,getAllProduct,bulkProductUploadController,updateProductController,getSingleProduct }