const express = require('express')
const path = require('path')

const router = express()
const adminRouter = require(path.join(__dirname,'../', 'routes', 'admin.js'))


router.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname, '../',  'views', 'home.html'))
})

router.get('/users' , (req,res)=>{
    res.render('users', {titleName : "Users", users: adminRouter.users})
})

module.exports = router