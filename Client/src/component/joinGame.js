import React ,{useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

const JoinGame = ({location}) =>{

    const [room,setRoom] = useState('')
    const [name,setName] = useState('')

    useEffect(() => {
        const {name} = queryString.parse(location.search);
        console.log(name)
        setName(name)
        
    });



return(

    <div className="container">
    <h1>Rejoindre une partie</h1>
    <h3>code de la partie :</h3>
    <input placeholder="code" onChange={(event)=> setRoom(event.target.value)}/>
    <Link to={`/gameMenu?name=${name}&room=${room}`}>
    <button type="submit" className="btn btn-primary">go</button>
    
    </Link>
    
    </div>
    
)
}

export default JoinGame;