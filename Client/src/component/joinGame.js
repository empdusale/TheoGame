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
    const [message,setMessage] = useState('')

    useEffect(() => {
        socket = io(ENDPOINT)
        const {name} = queryString.parse(location.search);
        console.log(name)
        setName(name)
        let copyRooms = [];
        axios.get(`http://localhost:5000/users/getRooms`)
        .then(res => {
            copyRooms = res.data
            console.log('copyRoom :')
            console.log(copyRooms)
            setRooms(copyRooms);       
      }).then(()=> {
          
      })
         
        
    },[room]);

const existRoom= (roomid) => {
    console.log('CureentRoom :: '+room)
    console.log('Rooms : ')
    console.log(rooms)
    console.log('Index : ')
    let roomTemp = []
    rooms.map(roomm => roomTemp.push(roomm))
    console.log('Index');
    console.log(roomTemp);
    
    if (roomTemp.indexOf(roomid) === -1 ){
        console.log('index == -1')
        setMessage('la room n\'existe pas')
        return false
   
    }
    else{
        console.log('index == okkkkkkkkk')

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
    <br/>
    <p>{message}</p>
    
    </div>
    
)
}

export default JoinGame;