import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;

function GameMenu({location}){

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const[users,setUsers] = useState([]);

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        const { name,room} = queryString.parse(location.search);

        socket = io(ENDPOINT)

        
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room});
        socket.emit('joinRoom',{name,room})
        socket.on('UsersRoom',({room,users} )=>{
            setUsers(users);
            console.log(users)

        })

    }, [ENDPOINT,location.search])

    return(
        <div className="container">
            <h1>Game menu </h1>
            <h1>room : {room}</h1>
            <div>{users.map(user =>
                <div>{user.username}</div>
                )}
            </div>
            
            
        </div>
    )
}

export default GameMenu;