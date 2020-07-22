const express = require('express')
const http = require('http');
const socketio = require('socket.io')
const{addUser,getUser,deletteUser,getAllUser} = require('./utils/users')
const{addUserToRoom,getUsersRoom, getAllRoom,deletteUserToRoom} =require('./utils/room')
const usersRoute = require('./route/users')
const cors = require('cors');

const app = express()
const serveur = http.createServer(app);
const io = socketio(serveur)


const route  = require('./route/route');

app.use(cors())
app.use(route)
app.use('/users',usersRoute)

io.on('connection',(socket)=> {
    console.log('Nouvelle connection !!!')



    socket.on('joinRoom',({name,room}) => {
        let user = addUser(socket.id,name,room)
        addUserToRoom(user,room);
        console.log('Room : ')
        console.log(getAllUser());
        socket.join(user.room);
        io.to(room).emit('UsersRoom',{room :user.room,
        users : getUsersRoom(user.room) });


    })

    socket.on('join',({name ,room}) => {
        //console.log(name,room);
      

    })

    socket.on('joinGame',({name,pinGamme}) => {
        let user = addUser(socket.id,name,pinGamme)
        addUserToRoom(user,pinGamme);
        console.log('Game : ')
        console.log(getAllUser());
        socket.join(user.room);
        io.to(user.room).emit('GamePlayer',{pinGamme : user.room,
        users : getUsersRoom(user.room) });
    })

    socket.on('startGame',()=>{
        let user = getUser(socket.id);
        io.to(user.room).emit('gameStarted')
    })

    socket.on('disconnect',() => {
       
        let user = deletteUser(socket.id);
        console.log('USer delette :: ')
        console.log(socket.id)
        console.log(user);
        
         
        if(user){
            deletteUserToRoom(socket.id,user.room);
            io.to(user.room).emit('UsersRoom',{room : user.room,
                users : getUsersRoom(user.room) });
            io.to(user.room).emit('GamePlayer',{room : user.room,
                users : getUsersRoom(user.room) });
        }
        console.log('un utilisateur vient de partir !!')
        console.log(getAllRoom());
    })
})
const PORT = process.env.PORT || 5000;

serveur.listen(PORT , () => console.log(`Serveur listen on port ${PORT}`));

