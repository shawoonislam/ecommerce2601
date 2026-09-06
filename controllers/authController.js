const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {verificationEmail} = require('../utils/emailSender')

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
        res.status(200).json({
            success: true,
            message: "Login Successfull",
            data: {
                _id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role
            }
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

module.exports = {registrationController,loginController,verifyEmailController}