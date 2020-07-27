import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

let socket;




function GameMenu({location}){

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const[users,setUsers] = useState([]);
    const[rooms,setRooms] = useState([]);
    const[user,setUser] = useState({});
    const[message,setMessage] = useState('');
    const[messageQuestion,setMessageQuestion] = useState('');
    const[id,setId] = useState('');
    const[nbQuestion,setNbQuestion] = useState(null);

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        var { name, room,id} = queryString.parse(location.search);

        socket = io(ENDPOINT)
        if(!room){
        room = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        console.log(room);
        }
        console.log('id :::::::: ',id)

        setId(id);
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room});
        socket.emit('joinRoom',{name,room,id})
        socket.on('UsersRoom',({room,users} )=>{
            console.log(users)
            setUsers(users);
            console.log(users)
            let user = users.find(user => user.id == socket.id)
            setUser(user);

        })
        socket.on('resetid',()=>{
            setId(undefined)
        })
        
        
        socket.on('gameStarted',()=> {
            if(id == undefined){
                window.location = `http://localhost:3000/game?name=${name}&pinGamme=${room}&id=${socket.id}`
            }
            else{
                window.location = `http://localhost:3000/game?name=${name}&pinGamme=${room}&id=${id}`

            }
        })

    }, [ENDPOINT,location.search])

    const startGame = () => {
        if(users.length < 3){
            setMessage('il faut etre 3 joueur minimum')
        }
        else if(nbQuestion == null){
            setMessageQuestion('veuillez un nombre de question')
        }
        else{
            socket.emit('startGame',{id:id,nbQuestion: nbQuestion});
        }
        
    }
    
    if(user.role === 'admin'){
        return(
            <div className="container">
                <h1>Game menu </h1>
                <h1>room : {room}</h1>
                <br/>
                <div>{users.map(user =>
                    <div>{user.username}</div>
                    )}
                </div>
                <br/>
                <h3>Nombre de question :</h3>
                <input placeholder="nombre de Question" onChange={(event)=> setNbQuestion(event.target.value)}/>
                <p>{messageQuestion}</p>
                
                
                <button onClick={() => startGame()} className="btn btn-primary" type="submit">Commencer le jeu</button>
                <br/>
                <br/>
                <p>{message}</p>
                               
            </div>
        )
    }
    else{
        return(
            <div className="container">
                <h1>Game menu </h1>
                <h1>room : {room}</h1>
                <br/>
                <div>{users.map(user =>
                    <div>{user.username}</div>
                    )}
                </div>
                
    
                
            </div>
        )


    }
    
    
}


export default GameMenu;