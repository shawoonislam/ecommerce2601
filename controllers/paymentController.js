let axios = require('axios')
let Cart = require('../models/cartSchema')
let Coupon = require('../models/couponSchema')
let Order = require('../models/orderSchema')

let paymentController = async (req,res) => {

  let{desc,cus_name,cus_email,cus_add1,cus_add2,cus_city,cus_state,cus_postcode,cus_phone,owner,coupon} = req.body

  
  let findCart = await Cart.find({owner: owner}).populate('productId').lean()


  let total = 0
  // let products = []

  findCart.map((item)=>{
    // products.push(item)
    if(item.productId.discountType == 'percent'){
        let afterDiscount = ((item.productId.price * item.productId.discountPrice) / 100) * item.quantity
        total += afterDiscount

      }else{
        let afterDiscount = (item.productId.price - item.productId.discountPrice) * item.quantity
        total += afterDiscount
      }
  })

  // kaj baki ase
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
  const tran_id = Date.now()

  try {
    const paymentData = {
      store_id: "aamarpaytest",
      tran_id: tran_id,
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

    console.log(tran_id)

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

    let order = new Order({
      tran_id: tran_id,
      owner: owner,
      amount: total,
      coupon: coupon,
      desc: desc,
      products: findCart
    })

    order.save()

  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
}

let paymentVerify = async (req,res) => {
  let {id,owner} = req.params

  const response = await axios.get(
      `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${id}&store_id=aamarpaytest&signature_key=dbb74894e82415a2f7ff0ec3a97e4183&type=json`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if(response.data.pay_status == "Successful"){
      let data = await Order.findOneAndUpdate({tran_id: id},{status: "PAID"})
      await Cart.deleteMany({owner: owner})

    }else if(response.data.pay_status == "Failed"){
      let data = await Order.findOneAndUpdate({tran_id: id},{status: "FAILED"})
    }

    res.status(200).json({
      success: true,
      message: "Updated"
    })


}


// todo => coupon / faild hole abar payment kora / review comment / multiple image delete




module.exports = {paymentController,paymentVerify}