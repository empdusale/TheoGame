const express = require('express');
const router = express.Router();
const { getAllRoom, getAllRoomId } = require('../utils/room')


router.get('/getRooms', (req, res) => {
    let rooms = getAllRoomId()
    console.log(rooms);
    res.send(rooms)
})

module.exports = router;