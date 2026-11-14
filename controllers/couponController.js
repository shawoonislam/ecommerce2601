let User = require('../models/userSchema')
let Coupon = require('../models/couponSchema')

let createCoupon = async (req,res)=>{
    let { code,couponType,couponAmount,minimumAmount,owner } = req.body

    let existingCoupon = await Coupon.findOne({code: code})

    if(existingCoupon){
        return res.status(400).json({
            success: false,
            message: "Coupon already exists"
        })
    }

    let user = await User.findOne({_id: owner})

    if(user.role != 'vendor'){
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        })
    }

    let coupon = new Coupon({
        code: code,
        couponType: couponType,
        couponAmount: couponAmount,
        minimumAmount: minimumAmount ? minimumAmount : minimumAmount*3 ,
        owner: owner
    })

    coupon.save()

    res.status(201).json({
        success: true,
        message: "Coupon Created"
    })




}

module.exports = {createCoupon}