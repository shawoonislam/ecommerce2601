let User = require('../models/userSchema')

let allUserController = async (req,res)=>{
    let users = await User.find({}).select('-password')
    res.status(200).json({
            success: true,
            message: `${users.length} users found`,
            data:users
        }
    )
}

// hw delete user

let singleUser = async (req,res) => {
    let {id} = req.params

    let data = await User.findById({_id: id}).select('-password')

    res.status(200).json({
        success: true,
        message: `User infor`,
        data: data

    })

}

let activeUser = async (req,res) => {

    let data = await User.find({status: 'active'})

    res.status(200).json({
        success: true,
        message: `Active User infor`,
        data: data

    })

}

let deActiveUser = async (req,res) => {

    let data = await User.find({status: 'deactive'})

    res.status(200).json({
        success: true,
        message: `Deactive User infor`,
        data: data

    })

}

let updateUser = async (req,res)=>{
    let {id} = req.params

    await User.findByIdAndUpdate({_id:id},req.body,{new: true})

    res.status(200).json({
        success: true,
        message: `User Updated`,

    })

}





module.exports = {allUserController,singleUser,activeUser,deActiveUser,updateUser}