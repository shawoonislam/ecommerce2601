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
    let {title, description, shortDescription, brand, price, discountPrice, category, subCategory,isMain,owner} = req.body

   let images = []
    req.files.map((item, index) => {
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
        discountPrice: discountPrice,
        category: category,
        subCategory: subCategory,
        slug: slug,
        sku: sku,
        images: images,
        owner: owner
    })

    product.save()

    res.status(201).json({
        success: true,
        message: "Product Created",
        product: product
    })

}

let getAllProduct = async (req,res) =>{
    let product = await Product.find({}).populate(['category', 'subCategory' , 'owner'])

    res.status(200).json({
        success: true,
        message: "All products",
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



module.exports = { createProduct,getAllProduct,bulkProductUploadController }