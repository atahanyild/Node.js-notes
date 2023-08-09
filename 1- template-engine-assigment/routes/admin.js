const express = require('express')

const router = express()

const users = []

router.post('/admin/create-user', (req, res) => {
    console.log(req.body)
    users.push({username: req.body.title})
    res.redirect('/')
})

module.exports.router = router
module.exports.users = users