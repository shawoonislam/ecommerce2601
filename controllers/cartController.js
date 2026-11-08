let Product = require('../models/productSchema')
let Cart = require('../models/cartSchema')

let createCart = async (req,res)=>{
    let {productId, quantity=1, owner} = req.body

    if(!owner || !productId){
        return res.status(400).json({
            success: false,
            message: "Invalid Data"
        })
    }
    let existingProduct = await Product.findOne({_id: productId})

    let existingCart = await Cart.findOne({productId: productId, owner: owner})

    if(existingCart){
        let total = existingCart.quantity + 1
        if(total > existingProduct.stock){
            return res.status(400).json({
                success: false,
                message: "Out of Stock"
             })
        }
        existingCart.quantity = existingCart.quantity + 1
        existingCart.save()
        return res.status(201).json({
            success: true,
            message: "Cart added"
        })
    }

    if(existingProduct.stock >= quantity){
        
        let cart = new Cart({
            productId:productId,
            quantity:quantity,
            owner:owner
        })

        cart.save()

        res.status(201).json({
            success: true,
            message: "Cart added"
        })

    }else{
        res.status(400).json({
            success: false,
            message: "Out of Stock"
        })

    }




}

let increDecre = async (req,res)=> {
   let {cartId, quantity, owner, type} = req.body

    let existingCart = await Cart.findOne({_id: cartId, owner: owner}).populate('productId')

    console.log(existingCart)
    if(type== 'plus'){

        let total = existingCart.quantity + quantity
        console.log(total,existingCart.stock, total > existingCart.stock)

        if(total > existingCart.productId.stock){
            return res.status(400).json({
                success: false,
                message: "Out of Stock"
             })
        }else{

            existingCart.quantity = existingCart.quantity + quantity
        }

    }else{
        if( existingCart.quantity > 1){

            existingCart.quantity = existingCart.quantity - quantity
        }else{
            // delete cart if quatity is 0
            return res.status(400).json({
                success: false,
                message: "Quantity value must be greater then 1"
            })
        }

    }


    existingCart.save()

    res.status(201).json({
            success: true,
            message: "Cart updated"
        })

    


}

let getCart = async (req,res) => {
    let {owner} = req.body

    let carts = await Cart.find({owner}).populate('productId')

    console.log(carts)


}

module.exports = {createCart,increDecre,getCart}