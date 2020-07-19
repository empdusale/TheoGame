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
        <button className="btn btn-primary btn-lg btn-block" type="submit">Rejoindre une partie</button>
        </Link>
        
        <button className="btn btn-secondary btn-lg btn-block" type="submit">Creer une partie</button>
    </div>
    
)

}

export default Menu;