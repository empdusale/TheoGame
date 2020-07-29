import React ,{useState,useEffect}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

let socket;
let roomi;




function GameMenu({location}){

    const[name,setName] = useState('');
    const[room,setRoom] = useState('test');
    const[users,setUsers] = useState([]);
    const[rooms,setRooms] = useState([]);
    const[user,setUser] = useState({});
    const[message,setMessage] = useState('');
    const[messageQuestion,setMessageQuestion] = useState('');
    const[id,setId] = useState('');
    const[choixJeux,setChoixJeux] = useState('game')
    const[nbQuestion,setNbQuestion] = useState(10);
    const[compteur,setCompteur] = useState(0);

    const ENDPOINT = 'localhost:5000'

    useEffect(()=> {
        

        socket = io(ENDPOINT)
        
        console.log('id :::::::: ',id)
        if(compteur == 0){
            var { name,room,id} = queryString.parse(location.search);
            console.log('Room requette = ')
            console.log('entrer dans compteur')
            console.log('room = ' +room)
            socket.emit('requetteGetRoom',(room));
            setName(name);
            setId(id);
            setCompteur(1)
            console.log('compteur == '+compteur)
        }
        socket.on('getroom',({roomId})=>{
            console.log('ROOOM CLIENT')
            console.log(roomId)
            setRoom(roomId);
            roomi = roomId
            console.log('room state = '+roomi)
            //console.log(roomi)
            socket.emit('joinRoom',{name,roomi,id})
        })
        
        
        //socket.emit('join',{name,room});
        
        socket.on('UsersRoom',({room,users} )=>{
            console.log(users)
            setUsers(users);
            console.log(users)
            let user = users.find(user => user.id == socket.id)
            setUser(user);

        })
        socket.on('resetid',()=>{
            id = undefined;
            setId(id)
            console.log('Socket User :: '+socket.id)
            console.log('id ::::: '+id)
        })
        
        
        socket.on('gameStarted',({choixJeux})=> {
            console.log('Game STTTTTTTTTTARRRRTTTTED IDD ::::::>>>>  : '+id)
            if(choixJeux == 'game'){
                if(id == undefined){
                    window.location = `http://localhost:3000/game?name=${name}&pinGamme=${roomi}&id=${socket.id}`
                }
                else{
                    window.location = `http://localhost:3000/game?name=${name}&pinGamme=${roomi}&id=${id}`
    
                }

            }else{
                if(id == undefined){
                    window.location = `http://localhost:3000/game2?name=${name}&pinGamme=${roomi}&id=${socket.id}`
                }
                else{
                    window.location = `http://localhost:3000/game2?name=${name}&pinGamme=${roomi}&id=${id}`
    
                }

            }
            
        })

    }, [ENDPOINT,location.search])

    const startGame = () => {
        if(users.length < 3){
            setMessage('il faut etre 3 joueur minimum')
        }
        else{
            socket.emit('startGame',{id:id,nbQuestion: nbQuestion,choixJeux : choixJeux});
        }
        
    }
    const retourAcceuil = () => {
        window.location = `http://localhost:3000/`
    }
    
    if(user.role === 'admin'){
        return(
            <div className="container">
                <h1>Game menu </h1>
                <h1>room : {room}</h1>
                <br/>
                <h4>Utilisateurs connectés :</h4>
                <ul>
                {users.map(user =>
                    <li><h6>{user.username} </h6></li>
                    )}
                </ul>
                <br/>
                <h4>Nombre de question :</h4>
                <select name="nbQuestion" id="question-select" onChange={(event)=> setNbQuestion(event.target.value)}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                </select>
                <br/>
                <br/>
                <h4>Choix du jeu :</h4>
                <select name="Choix du jeu :" id="question-select2" onChange={(event)=> setChoixJeux(event.target.value)}>
                <option value="game">game</option>
                <option value="game2">game2</option>
                </select>
                <br/>
                <br/>
                <button onClick={() => startGame()} className="btn btn-primary" type="submit">Commencer le jeu</button>
                <br/>
                <p>{message}</p>
                <button onClick={() => retourAcceuil()} className="btn btn-danger" type="submit">retour au menu</button>
                
                               
            </div>
        )
    }
    else{
        return(
            <div className="container">
                <h1>Game menu </h1>
                <h1>room : {room}</h1>
                <br/>
                <h4>Utilisateurs connectés :</h4>
                <ul>
                {users.map(user =>
                    <li><h6>{user.username}</h6></li>
                    )}
                </ul>
                <br/>
                <button onClick={() => retourAcceuil()} className="btn btn-danger" type="submit">retour au menu</button>
                
    
                
            </div>
        )


    }
    
    
}


export default GameMenu;