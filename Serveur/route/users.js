const express = require('express');
const router = express.Router();
const {getAllRoom} = require('../utils/room')


router.get('/getRooms',(req,res) => {
    let rooms = getAllRoom()
    console.log(rooms);
    res.send(rooms)
})

module.exports = router;