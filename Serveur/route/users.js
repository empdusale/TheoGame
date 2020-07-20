const express = require('express');
const router = express.Router();
const {getAllRoom} = require('../utils/users')


router.get('/getRooms',(req,res) => {
    let rooms = getAllRoom()
    res.send(rooms)
})

module.exports = router;