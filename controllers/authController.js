const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {verificationEmail, forgotPasswordEmail} = require('../utils/emailSender');
const { findById, findOne } = require('../models/categorySchema');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;




let registrationController = async (req,res)=>{
    let {fullName, email, password, confirmPassword, terms} = req.body

    let existingUser = await User.findOne({email: email})

    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "Email alrady exist"
        })
    }

    if(!fullName || !email || !password || !confirmPassword || !terms ){
        return res.status(400).json({
            success: false,
            message: "Please Fill The All Fields"
        })
    }


    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        })
    }


    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password not match"
        })
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = new User({
        fullName: fullName,
        email: email,
        password: hash,
        terms: terms
    })

    user.save()


    let verificationToken = jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    },process.env.JWT_VERIFY_SECRET,{
        expiresIn: '7d'
    })

    verificationEmail(email,verificationToken)

    res.status(201).json({
        success: true,
        message: 'Registration Done'
    })
}


let loginController = async (req,res) => {
    let {email,password} = req.body

     let existingUser = await User.findOne({email: email})

    if(!existingUser){
        return res.status(400).json({
            success: false,
            message: "Invalid Creadencial"
        })
    }

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Please Fill The All Fields"
        })
    }

     if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        })
    }

    let passCompare = bcrypt.compareSync(password, existingUser.password)

    if(passCompare){
        let accessToken = jwt.sign({
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        },process.env.JWT_VERIFY_SECRET,{
            expiresIn: '30d'
        })
        res.status(200).json({
            success: true,
            message: "Login Successfull",
            data: {
                _id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role
            },
            accessToken: accessToken
        })
    }else{
        return res.status(400).json({
            success: false,
            message: "Invalid Credential"
        })
    }



}

let verifyEmailController = async (req,res) =>{
    let {token} = req.params

    var decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    
    await User.findByIdAndUpdate({_id:decoded._id}, {isVerified: true})

    res.status(200).json({
        success: true,
        message: "Email Verified"
    })

}



let forgotPassword = async (req,res)=>{
    let {email} = req.body

    let existingUser = await User.findOne({email: email})

    if(!existingUser){
        return res.status(400).json({
            success: false,
            message: "User Not Found"
        })
    }

    let resetPasswordToken = jwt.sign({
            _id: existingUser._id,
            email: existingUser.email,
        },process.env.JWT_VERIFY_SECRET,{
            expiresIn: '3d'
        })

    forgotPasswordEmail(email,resetPasswordToken)

    res.status(200).json({
        success: false,
        message: "Please Check Your Email for Reseting Password"
    })

}


let resetPassword = async (req,res) => {
    let {token} = req.params
    let {newPassword, confirmPassword} =  req.body

    var decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);

    if(decoded){
        if(newPassword == confirmPassword){
            const hash = bcrypt.hashSync(newPassword, 10);
            await User.findByIdAndUpdate({_id:decoded._id},{password: hash})
            return res.status(200).json({
                success: true,
                message: "Password Update Done"
            })
        }else{
            return res.status(400).json({
                success: false,
                message: "Password not match"
            })
        }
    }

    
    

}





// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTlkNGVkNTY2NGE3ZjkxOTk0MGUxYjEiLCJlbWFpbCI6InNoYXdvbi5jaXQuYmRAZ21haWwuY29tIiwiaWF0IjoxNzg5MjA4MzcwLCJleHAiOjE3ODk0Njc1NzB9.wmg7tsn_Num5ypLBvSEC_Bvw6T9On5H_2OHIJxH-y9w


module.exports = {registrationController,loginController,verifyEmailController,forgotPassword,resetPassword}