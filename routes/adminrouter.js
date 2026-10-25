const express = require('express');
const { allUserController, singleUser, activeUser, deActiveUser, updateUser,activeDeactiveCategory } = require('../controllers/adminController');
const _ = express.Router();

_.get('/all-user',allUserController)
_.get('/user/:id',singleUser)
_.get('/active/user',activeUser)
_.get('/deactive/user',deActiveUser)
_.post('/update/user/:id',updateUser)

_.post('/category/status/change/:id',activeDeactiveCategory)

module.exports = _