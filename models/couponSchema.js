const mongoose = require('mongoose');
const {Schema} = mongoose

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    couponType: {
        type: String,
        enum: ['percent', 'fixed']
    },
    couponAmount: {
        type: Number
    },
    minimumAmount: {
        type: Number
    },
    redeemCustomers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }

})



module.exports = mongoose.model('Coupon',couponSchema)