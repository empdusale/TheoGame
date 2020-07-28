const express = require('express')
const http = require('http');
const socketio = require('socket.io')
const{addUser,getUser,deletteUser,getAllUser} = require('./utils/users')
const{addUserToRoom,getUsersRoom, getAllRoom,deletteUserToRoom, getRoom} =require('./utils/room')
const{getQuestion, addUserToGame,getUsersGame,deletteUserToGame, getAllGames, getGame,setUserTrier,createGame} = require('./utils/game')
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



    socket.on('joinRoom',({name,room,id}) => {
        let user = addUser(socket.id,name,room)
        addUserToRoom(user,room,id);
        console.log('Room : ')
        console.log(getAllUser());
        socket.join(user.room);
        io.to(room).emit('UsersRoom',{room :user.room,
        users : getUsersRoom(user.room) });


    })

    socket.on('join',({name ,room}) => {
        //console.log(name,room);
      

    })

    socket.on('joinGame',({name,pinGamme,id}) => {
        let user = addUser(socket.id,name,pinGamme)
        user.inGame = true;
        addUserToGame(user,pinGamme,id);
        //console.log('Game : ')
        //console.log(getAllGames());
        socket.join(user.room);
        //console.log('USER GAME')
        //console.log(getUsersGame(user.room))
        socket.emit('getCurentQuestion',{CurrentQuestion : getGame(user.room).currentQuestion})
        io.to(user.room).emit('GamePlayer',{pinGamme : user.room,
            usersNew : getUsersGame(user.room),compteurQuestion : getGame(user.room).compteurQuestion,compteurQuestionMax : getGame(user.room).compteurQuestionMax,bonus : user.bonus
        });
    })

    socket.on('startGame',({id,nbQuestion})=>{
        
        let user = getUser(socket.id);
        let room = getRoom(user.room);
        room.inGame = true;
        console.log('idddddd :::::::: '+id)
        if(id === undefined){
            createGame(user.room,socket.id,nbQuestion)
        }
        else{
            createGame(user.room,id,nbQuestion)
        }
        io.to(user.room).emit('gameStarted')
    })

    socket.on('aVoter',({pinGamme,reponse}) => {
        
        let game = getGame(pinGamme);
        let user = getUser(socket.id);
        user.aVoter = true;
        let userVote = getUser(reponse);
        userVote.voterPar.push(user.username)
        userVote.nbDeVote++;
        user.voteFor = userVote.username;
        game.compteurVote++;
        if(game.compteurVote == game.users.length){
            setUserTrier(pinGamme);
            io.to(pinGamme).emit('getUserTrier',{userTrier : game.usersTrier})
        }
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
            user.aVoter = false;
        })
        game.CurrentQuestion = getQuestion(pinGamme).text;
        io.to(pinGamme).emit('getCurentQuestion',{CurrentQuestion : game.CurrentQuestion })
        io.to(pinGamme).emit('compteurVote',{compteur : game.compteurVote,users : getUsersGame(pinGamme),compteurQuestion : game.compteurQuestion});
    })

    socket.on('activateBonus',(pinGamme,name)=>{
        let afficheResultat = false;
        var nombre = 0;
        nombre = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        let message = `${name} vient d'activer son bonus`
        if(nombre == 0){
            afficheResultat = true
            
        }
        io.to(pinGamme).emit('attenteResultat',{message:message,afficheResultat : afficheResultat});
        //setTimeout(envoieResultat(pinGamme), 3000)
        //io.to(pinGamme).emit('bonnusActiver',{afficheResultat : true})
    })

    socket.on('requetteGoToRoom',(pinGamme)=>{
        let room = getRoom(pinGamme);
        room.inGame = false;
        io.to(pinGamme).emit('goToRoom');
    })
    

    socket.on('disconnect',() => {
       
        let user = deletteUser(socket.id);
        console.log('USer delette :: ')
        console.log(socket.id)
        console.log(user);
        
         
        if(user){
            
            if(user.inGame){
                let game = getGame(user.room);
                deletteUserToGame(socket.id,user.room);
                if(game.users.length < 3){
                    io.to(user.room).emit('goToRoom')
                }
                else{
                    if(user.aVoter == true){
                        game.compteurVote--;
                    }
                    if(getGame(user.room) === undefined){
    
                    }
                    else{
                        if(user.role === 'admin'){
                            console.log('Admin Disconect !!!!!!!!')
                            game.users[0].role = 'admin'
                            console.log('User Avant envoi');
                            console.log(game.users)
                            setUserTrier(user.room);
                            io.to(user.room).emit('compteurVote',{compteur : game.compteurVote,users : getUsersGame(user.room),compteurQuestion : game.compteurQuestion});
                            console.log('AdminSocket : '+game.userAdminSocket);
                            io.to(user.room).emit('changeAdmin',{socket: game.userAdminSocket});
        
                        }
                        else{
                            setUserTrier(user.room);
                            io.to(user.room).emit('compteurVote',{compteur : game.compteurVote,users : getUsersGame(user.room),compteurQuestion : game.compteurQuestion});

                        }                      
                    }
                }        
            }
            else{
                deletteUserToRoom(socket.id,user.room);
                if(user.role == 'admin'){
                    
                    let room = getRoom(user.room)
                    console.log('Valeur Ingame '+ room.inGame)
                    if(room.inGame == true){
                        console.log('in Game ==================  True')

                    }
                    else{
                        let users = getUsersRoom(user.room);
                        console.log('users :::::::=>   ')
                        console.log(users.length)
                        if(users.length === 0){
                    }
                    else{
                        users[0].role = 'admin'
                        let room = getRoom(user.room);
                        room.userAdminSocket = users[0].id;
                        console.log('SOCKETTTT____ROOOMMM : '+ room.userAdminSocket)
                        io.to(user.room).emit('resetid');
                    }


                    }
                    
                    
                    //io.to(user.room).emit('changeAdminRoom')
                }
                
                    io.to(user.room).emit('UsersRoom',{room : user.room,
                        users : getUsersRoom(user.room) });

            }          
        }
        console.log('un utilisateur vient de partir !!')
        console.log(getAllRoom());
    })
})
const PORT = process.env.PORT || 5000;

serveur.listen(PORT , () => console.log(`Serveur listen on port ${PORT}`));

