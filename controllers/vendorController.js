let Cat = require('../models/categorySchema')
let SubCat = require('../models/subCategorySchema')

let createCategory = async (req,res)=>{
    let {name,owner} = req.body

    let existingName = await Cat.findOne({name: name.toLowerCase()})

    if(existingName){
        return res.status(400).json({
            success: false,
            message: "Category Already Exists"
        })
    }

    let cat = new Cat({
        name: name.toLowerCase(),
        owner: owner
    })

    await cat.save()

    res.status(201).json({
        success: true,
        message: "Category Created"
    })

}

let getAllCategory = async (req,res)=>{
    let category = await Cat.find({}).populate('owner')

    res.status(200).json({
        success: true,
        message: "All Category",
        data: category
    })
}

let createSubCategory = async (req,res) =>{
    console.log("hello")
    let {name,parentCategory} = req.body
    let existingName = await SubCat.findOne({name: name.toLowerCase()})

    if(existingName){
        return res.status(400).json({
            success: false,
            message: "Sub Category Already Exists"
        })
    }

    let subCat = new SubCat({
        name: name.toLowerCase(),
        parentCategory: parentCategory
    })

    await subCat.save()

    res.status(201).json({
        success: true,
        message: "Sub Category Created"
    })
}

let getAllSubCategory = async (req,res)=>{
    let subCategory = await SubCat.find({}).populate('parentCategory')

    res.status(200).json({
        success: true,
        message: "All Category",
        data: subCategory
    })
}

let getAllCategoryWiseSubCategory = async (req,res)=>{
    let {id} = req.params
    console.log(id)
    let subCategory = await SubCat.find({parentCategory: id})

    res.status(200).json({
        success: true,
        message: "All Sub Category",
        data: subCategory
    })
}

let getAllOwnerWiseCategory =  async (req,res) => {
    let {id} = req.params

    let data = await Cat.find({owner: id})

    data.map(async (item)=>{
        console.log(item._id)
        let tintinatin = await SubCat.find({parentCategory: '6ab8fadcfab85481ddf3fa81'})
        console.log(tintinatin)
    })
    //  res.status(200).json({
    //     success: true,
    //     message: "All Category",
    //     data: data
    // })
}

module.exports = {createCategory,getAllCategory,createSubCategory,getAllSubCategory,getAllCategoryWiseSubCategory,getAllOwnerWiseCategory}