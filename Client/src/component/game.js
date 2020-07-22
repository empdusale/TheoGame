import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;


function Game({location}){

    const[name,setName] = useState('');
    const[pinGamme,setPinGamme] = useState('');
    const[users,setUsers] = useState([]);
    const[rooms,setRooms] = useState([])

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        var { name, pinGamme} = queryString.parse(location.search);

        socket = io(ENDPOINT)
        
        setName(name);
        setPinGamme(pinGamme);
        socket.emit('joinGame',{name,pinGamme})
        socket.on('GamePlayer',({pinGamme,users} )=>{
            setUsers(users);
        })
        

    }, [ENDPOINT,location.search])

    const startGame = () => {
        socket.emit('startGame');
    }
    
    return(
        <div className="container">
            <h1>La partie Commence </h1>
            
            <div>{users.map(user =>
                <button>  {user.username}</button>
                )}
            </div>
            
            
            
            
            
        </div>
    )
}


export default Game;