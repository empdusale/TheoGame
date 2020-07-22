import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;


function Game({location}){

    const[name,setName] = useState('');
    const[pinGamme,setPinGamme] = useState('');
    const[users,setUsers] = useState([]);
    const[rooms,setRooms] = useState([])
    const[question,setQuestion] = useState('qui est le plus beau ?');

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        var { name, pinGamme} = queryString.parse(location.search);

        socket = io(ENDPOINT)
        
        setName(name);
        setPinGamme(pinGamme);
        socket.emit('joinGame',{name,pinGamme})
        console.log('JOIN GAMME')
        socket.on('GamePlayer',({pinGamme,users} )=>{
            console.log('Game user ::')
            console.log(users)
            setUsers(users);

        })
        

    }, [ENDPOINT,location.search])

    const changeQuestion = () => {
        setQuestion('qui est le plus sympathique ?')
    }
    
    return(
        <div className="container">
            <h1>La partie Commence </h1>
            <br/>
            <h3>{question}</h3>
            <br/>
            <ul className="list-group" >{users.map(user =>
                <li className="list-group-item">
                <button onClick={() => changeQuestion()}type="button" className="btn btn-info">  {user.username}</button>
                </li>
                )}
            </ul>
            
            
            
            
            
        </div>
    )
}


export default Game;