require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require('express');
const app = express()
const authRouter = require('./routes/authrouter')
const userRouter = require('./routes/userrouter')
const adminRouter = require('./routes/adminrouter')
const vendorRouter = require('./routes/vendorRouter')
const mongodbConfig = require('./config/mongoDBConfig');
const { adminMiddleware, vendorMiddleware, userMiddleware } = require('./middlewares/roleMiddleware');


app.use(express.json())
mongodbConfig()


app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/user',userMiddleware, userRouter)
app.use('/api/v1/user', userRouter)
// app.use('/api/v1/admin',adminMiddleware, adminRouter)
app.use('/api/v1/admin', adminRouter)
// app.use('/api/v1/vendor',vendorMiddleware, vendorRouter)
app.use('/api/v1/vendor', vendorRouter)

const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})