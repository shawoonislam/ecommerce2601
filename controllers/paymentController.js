let axios = require('axios')
let Cart = require('../models/cartSchema')
let Coupon = require('../models/couponSchema')

let paymentController = async (req,res) => {

  let{desc,cus_name,cus_email,cus_add1,cus_add2,cus_city,cus_state,cus_postcode,cus_phone,owner,coupon} = req.body

  
  let findCart = await Cart.find({owner: owner}).populate('productId')


  let total = 0

  findCart.map((item)=>{
    if(item.productId.discountType == 'percent'){
        let afterDiscount = ((item.productId.price * item.productId.discountPrice) / 100) * item.quantity
        total += afterDiscount

      }else{
        let afterDiscount = (item.productId.price - item.productId.discountPrice) * item.quantity
        total += afterDiscount
      }
  })

    console.log(total)

  if(coupon){
    let existingCoupon = await Coupon.findOne({code: coupon})
    if(total < existingCoupon.minimumAmount){
      return res.status(400).json({
        success: false,
        message: "Please add more amount"
      })
    }

    

    if(existingCoupon.couponType == 'percent'){
        let afterDiscount = (total * existingCoupon.couponAmount) / 100
        total = +total - afterDiscount

      }else{
        let afterDiscount = item.productId.price - existingCoupon.couponAmount
        total = +total - afterDiscount
      }
  }






    try {
    const paymentData = {
      store_id: "aamarpaytest",
      tran_id: Date.now(),
      success_url: "http://www.merchantdomain.com/successpage.html",
      fail_url: "http://www.merchantdomain.com/failedpage.html",
      cancel_url: "http://www.merchantdomain.com/cancelpage.html",
      amount: total,
      currency: "BDT",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      desc: desc,
      cus_name: cus_name,
      cus_email: cus_email,
      cus_add1: cus_add1,
      cus_add2: cus_add2,
      cus_city: cus_city,
      cus_state: cus_state,
      cus_postcode: cus_postcode,
      cus_country: "Bangladesh",
      cus_phone: cus_phone,
      type: "json",
    };

    const response = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);

  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
}

module.exports = {paymentController}