const express = require('express')
const http = require('http');
const socketio = require('socket.io')
const{addUser,getUser,getRoomUsers,deletteUser,getAllUser} = require('./utils/users')
const usersRoute = require('./route/users')
const cors = require('cors');

const app = express()
const serveur = http.createServer(app);
const io = socketio(serveur)

const routrut = require('./route/route');
const route  = require('./route/route');

app.use(cors())
app.use(route)
app.use('/users',usersRoute)

io.on('connection',(socket)=> {
    console.log('Nouvelle connection !!!')



    socket.on('joinRoom',({name,room}) => {
        let user = addUser(socket.id,name,room)
        console.log(getAllUser());
        socket.join(user.room);
        io.to(user.room).emit('UsersRoom',{room : user.room,
        users : getRoomUsers(user.room) });


    })

    socket.on('join',({name ,room}) => {
        console.log(name,room);
      

    })

    socket.on('disconnect',() => {
        let user = deletteUser(socket.id);
         
        if(user){
            io.to(user.room).emit('UsersRoom',{room : user.room,
                users : getRoomUsers(user.room) });
        }
        console.log('un utilisateur vient de partir !!')
    })
})
const PORT = process.env.PORT || 5000;

serveur.listen(PORT , () => console.log(`Serveur listen on port ${PORT}`));

