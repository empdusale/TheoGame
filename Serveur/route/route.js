const express = require('express');
var routeur = express.Router();


routeur.get('/', (req,res)=> 
    res.send('serveur is ok')
)


module.exports = routeur