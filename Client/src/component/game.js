import React ,{Component}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;

const ENDPOINT = 'localhost:5000'

class Game extends Component {
    constructor(props){
        super(props)

        this.setUsers = this.setUsers.bind(this);
        this.setName = this.setName.bind(this);
        this.setPinGamme = this.setPinGamme.bind(this);
        this.changeQuestion = this.changeQuestion.bind(this)
        

        this.state = {
            users :[],
            name :"",
            pinGamme :"",
            location :props.location,
            question : "qui est le plus beau ?",
            reponse :  ""
        }
    }
    setUsers(users){
        this.setState({users : users})
        console.log('voici les users :')
        console.log(this.state.users)
    }
    setName(name){
      
        this.setState({name : name})
        console.log('this.state.name : '+ this.state.name);


    }
    setPinGamme(pinGamme){
        this.setState({pinGamme : pinGamme})
    }

    changeQuestion(e) {
        this.setState({
            question : "qui est le plus lourd ?"
        })
        
        this.setState({
            reponse : e.target.value
        })

    }

    

    componentDidMount() {
        var { name, pinGamme} = queryString.parse(this.state.location.search);

        socket = io(ENDPOINT)
        
        this.setState({
            name : name,
            pinGamme : pinGamme
        })
        
        
        socket.emit('joinGame',{name,pinGamme})
        console.log('JOIN GAMME')
        socket.on('GamePlayer',({pinGamme,users} )=>{
            console.log('Game user ::')
            console.log(users)
            this.setUsers(users);

        })

        
      }
    render( ){
        return(
            <div className="container">
            <h1>La partie Commence </h1>
            <br/>
            <h3>{this.state.question}</h3>
            <br/>
            <ul className="list-group" >{this.state.users.map(user =>
                <li className="list-group-item">
                <button  type="button" className="btn btn-info" value={user.username} onClick={(e) => this.changeQuestion(e)} >  {user.username}</button>
                </li>
                )}
            </ul>
            <h2>{this.state.reponse}</h2>
            
            
            
            
            
        </div>

            )



    }
      
    

}
/*function Game({location}){

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

    const changeQuestion = (btn) => {
        setQuestion('qui est le plus sympathique ?')
        console.log('Valeur bouton = '+ btn);
    }
    
    return(
        <div className="container">
            <h1>La partie Commence </h1>
            <br/>
            <h3>{question}</h3>
            <br/>
            <ul className="list-group" >{users.map(user =>
                <li className="list-group-item">
                <button  type="button" className="btn btn-info" value={user.username} onClick={this.changeQuestion}>  {user.username}</button>
                </li>
                )}
            </ul>
            
            
            
            
            
        </div>
    )
}
*/


export default Game;