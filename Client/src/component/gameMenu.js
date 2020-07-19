import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;

function GameMenu({location}){

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        const { name,room} = queryString.parse(location.search);

        socket = io(ENDPOINT)

        
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room});

    }, [ENDPOINT,location.search])

    return(
        <div className="container">
            <h1>Game menu </h1>
    <h1>room : {room}</h1>
            
        </div>
    )
}

export default GameMenu;