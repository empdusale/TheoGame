import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import  { Redirect } from 'react-router-dom'
let socket;




function GameMenu({location}){

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const[users,setUsers] = useState([]);
    const[rooms,setRooms] = useState([])

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        var { name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT)
        if(!room){
        room = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        console.log(room);
        }

        
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room});
        socket.emit('joinRoom',{name,room})
        socket.on('UsersRoom',({room,users} )=>{
            console.log(users)
            setUsers(users);
            console.log(users)

        })
        
        socket.on('gameStarted',()=> {
            window.location = `http://localhost:3000/game?name=${name}&pinGamme=${room}`
        })

    }, [ENDPOINT,location.search])

    const startGame = () => {
        socket.emit('startGame');
    }
    
    return(
        <div className="container">
            <h1>Game menu </h1>
            <h1>room : {room}</h1>
            <div>{users.map(user =>
                <div>{user.username}</div>
                )}
            </div>
            
            <button onClick={() => startGame()} className="btn btn-primary" type="submit">Commencer le jeu</button>
            
            
            
        </div>
    )
}


export default GameMenu;