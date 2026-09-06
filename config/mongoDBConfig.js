const mongoose = require('mongoose')

function mongodbConfig(){
    console.log("hello")
    return mongoose.connect(process.env.MOGODB_URL).then(()=>{
        console.log('mongoDB connected')
    })
    // .catch(error =>{
    //     console.log("MongoDB Connection Error:". error)
    // })
}

module.exports = mongodbConfig