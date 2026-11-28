const mongoose = require('mongoose');
const {Schema} = mongoose

const reviewSchema = new Schema({
  
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },

    rating: {
        type: Number,
        max: 5,
        min: 1
    }

    


})

module.exports = mongoose.model('Review',reviewSchema)