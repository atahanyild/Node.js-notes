const express = require('express')
const path = require('path')

const userRouter = require('./routes/user.js')
const adminRouter = require('./routes/admin.js')

const app = express()
app.set('view engine' , 'ejs')

app.use(express.urlencoded())

app.use(userRouter)

app.use(adminRouter.router)


app.listen(3000)