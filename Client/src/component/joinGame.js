import React ,{useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client'
import axios from 'axios'
let socket;
const ENDPOINT = 'localhost:5000'

const JoinGame = ({location}) =>{

    const [room,setRoom] = useState('')
    const [name,setName] = useState('')
    const [rooms,setRooms] = useState([])

    useEffect(() => {
        socket = io(ENDPOINT)
        const {name} = queryString.parse(location.search);
        console.log(name)
        setName(name)
        let copyRooms = [];
        axios.get(`http://localhost:5000/users/getRooms`)
        .then(res => {
            copyRooms = res.data
            console.log(copyRooms)
            setRooms(copyRooms);       
      }).then(()=> {
          
      })
      console.log("exist room "+ existRoom(4000))
      
      
        
        
    },[room]);

const existRoom= (roomid) => {
    console.log(rooms)
    console.log(rooms.indexOf(roomid));
    if (rooms.indexOf(roomid) === -1 ){
        
        return false
    }
    else{
        return true;
    }

   
}

return(

    <div className="container">
    <h1>Rejoindre une partie</h1>
    <h3>code de la partie :</h3>
    <input placeholder="code" onChange={(event)=> setRoom(event.target.value)}/>
    <Link onClick={event => (existRoom(room)) ? null:  event.preventDefault() } to={`/gameMenu?name=${name}&room=${room}`}>
    <button type="submit" className="btn btn-primary">go</button>
    
    </Link>
    
    </div>
    
)
}

export default JoinGame;