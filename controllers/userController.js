let Cat = require('../models/categorySchema')

let userController = (req,res)=>{
    
    res.send("hello user")
}

let createCategory = async (req,res)=>{
    let {name} = req.body

    let existingName = await Cat.findOne({name: name.toLowerCase()})

    if(existingName){
        return res.status(400).json({
            success: false,
            message: "Category Already Exists"
        })
    }

    let cat = new Cat({
        name: name.toLowerCase()
    })

    await cat.save()

    res.status(201).json({
        success: true,
        message: "Category Created"
    })

}

let getAllCategory = async (req,res)=>{
    let category = await Cat.find({})

    res.status(200).json({
        success: true,
        message: "All Category",
        data: category
    })
}

module.exports = {userController,createCategory,getAllCategory}