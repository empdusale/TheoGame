import React,{useState} from 'react';
import { Link } from 'react-router-dom';

const Menu = () =>{

const [name,setName] = useState('');
const errorMessage = 'Veuillez entrez un nom'


return(
    <div className="container">
        <h1>menu</h1>
        <h3>entrer votre pseudo</h3>
        <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}/>
        <p></p>
        <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/joinGame?name=${name}`}>
        <button className="btn btn-primary" type="submit">Rejoindre une partie</button>
        </Link>
        <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/gameMenu?name=${name}`}>
        <button className="btn btn-secondary" type="submit">Creer une partie</button>
        </Link>
    </div>
    
)

}

export default Menu;