const express = require('express')
const http = require('http');
const socketio = require('socket.io')
const{addUser,getUser,deletteUser,getAllUser} = require('./utils/users')
const{addUserToRoom,getUsersRoom, getAllRoom,deletteUserToRoom} =require('./utils/room')
const{getQuestion, addUserToGame,getUsersGame,deletteUserToGame, getAllGames, getGame} = require('./utils/game')
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
        user.inGame = true;
        addUserToGame(user,pinGamme);
        addUserToRoom(user,pinGamme);
        console.log('Game : ')
        console.log(getAllGames());
        socket.join(user.room);
        console.log(getUsersGame(user.room))
        console.log('question : '+ getGame(user.room).currentQuestion )
        socket.emit('getCurentQuestion',{CurrentQuestion : getGame(user.room).currentQuestion})
        io.to(user.room).emit('GamePlayer',{pinGamme : user.room,
        users : getUsersGame(user.room),compteurQuestion : getGame(user.room).compteurQuestion,compteurQuestionMax : getGame(user.room).compteurQuestionMax
        });
    })

    socket.on('startGame',()=>{
        let user = getUser(socket.id);
        io.to(user.room).emit('gameStarted')
    })

    socket.on('aVoter',({pinGamme,reponse}) => {
        let game = getGame(pinGamme);
        let user = getUser(socket.id);
        let userVote = getUser(reponse);
        userVote.voterPar.push(user.name)
        userVote.nbDeVote++;
        user.voteFor = userVote.username;
        game.compteurVote++;
        io.to(pinGamme).emit('compteurVote',{compteur : game.compteurVote,users : getUsersGame(pinGamme),compteurQuestion : game.compteurQuestion});

    })

    socket.on('nextQuestion',(pinGamme)=>{
        let game = getGame(pinGamme);
        game.compteurQuestion++
        game.compteurVote = 0;
        game.users.map(user => {
            user.voteFor = '';
            user.voterPar = [];
            user.nbDeVote = 0;
        })
        game.CurrentQuestion = getQuestion().text;
        io.to(pinGamme).emit('getCurentQuestion',{CurrentQuestion : game.CurrentQuestion })
        io.to(pinGamme).emit('compteurVote',{compteur : game.compteurVote,users : getUsersGame(pinGamme),compteurQuestion : game.compteurQuestion});
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
            if(user.inGame){
                deletteUserToGame(socket.id,user.room);
                io.to(user.room).emit('GamePlayer',{room : user.room,
                    users : getUsersGame(user.room) });
            }          
        }
        console.log('un utilisateur vient de partir !!')
        console.log(getAllRoom());
    })
})
const PORT = process.env.PORT || 5000;

serveur.listen(PORT , () => console.log(`Serveur listen on port ${PORT}`));

