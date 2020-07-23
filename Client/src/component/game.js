import React ,{Component}from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;


const ENDPOINT = 'localhost:5000'

class Game extends Component {
    constructor(props){
        super(props)

        this.setUsers = this.setUsers.bind(this);
        this.changeQuestion = this.changeQuestion.bind(this)
        this.setQuestion = this.setQuestion.bind(this);
        

        this.state = {
            users :[],
            usersView : [],
            name :"",
            pinGamme :"",
            location :props.location,
            question : "",
            reponse :  "",
            aRepondu : false,
            compteurVote : 0,
            compteurQuestion : null,
            compteurQuestionMax : null

            
        }
    }
    setUsers(users){
        this.setState({users : users})
        console.log('voici les users :')
        console.log(this.state.users)
    }

    setUsersView(users){
        let copyUser = users;
        const index = copyUser.findIndex(user => user.id === socket.id);
        if (index !== -1){
            copyUser.splice(index,1)
            this.setState({usersView : copyUser})
               
        }
        
    }
    setQuestion(question){
        this.setState({question : question})
    }


    vote(e) {
        
        console.log('id : ',e.target.value)

        socket.emit('aVoter',{pinGamme : this.state.pinGamme ,reponse : e.target.value})
        let user = this.state.users.find(user => user.id === e.target.value)
        this.setState({
            reponse : user.username,
            aRepondu : true,
            
        })
    }

    changeQuestion(e){
        socket.emit('nextQuestion',this.state.pinGamme);

    }
    componentDidMount() {
        var { name, pinGamme} = queryString.parse(this.state.location.search);

        socket = io(ENDPOINT)
        
        this.setState({
            name : name,
            pinGamme : pinGamme
        })
        
        socket.on('getCurentQuestion',({CurrentQuestion}) => {
            console.log('QUESSSSSTION : '+ CurrentQuestion)
            this.setQuestion(CurrentQuestion)
            this.setState({
                aRepondu :false
            })

        }
        )
        socket.on('compteurVote',({compteur,users,compteurQuestion})=>{
            this.setState({
                compteurVote : compteur,
                users : users,
                compteurQuestion : compteurQuestion
            })
            console.log('USERS :::::: ')
            console.log(this.state.users)

        })
        socket.emit('joinGame',{name,pinGamme})
        console.log('JOIN GAMME')
        socket.on('GamePlayer',({pinGamme,users,compteurQuestion,compteurQuestionMax} )=>{
            console.log('Game user ::')
            console.log('GAMMMMEEE PLAYYYER')
            console.log(users)
            this.setUsers(users);
            this.setUsersView(users);
            this.setState({
                compteurQuestion : compteurQuestion,
                compteurQuestionMax : compteurQuestionMax
            }
            )
        })      
      }
      
    render( ){
        if(this.state.aRepondu === false){
            return(
                <div className="container">
                <h1>La partie Commence </h1>
                <br/>
                <h3>{this.state.question}</h3>
                <br/>
                <ul className="list-group" >{this.state.usersView.map(user =>
                    <li className="list-group-item">
                    <button  type="button" className="btn btn-info" value={user.id} onClick={(e) => this.vote(e)} >  {user.username}</button>
                    </li>
                    )}
                </ul> 
                <h3>Question {this.state.compteurQuestion}/{this.state.compteurQuestionMax}</h3>         
            </div>
                )
        } 
        else{
            if(this.state.compteurVote === this.state.users.length){
                return(
                    <div className="container">
                    <h1>voici les résultat : </h1>
                    <br/>
                    <h3>{this.state.question}</h3>
                    <br/>
                    <ul className="list-group" >{this.state.users.map(user =>
                    <li className="list-group-item">
                    <button  type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                    <h4>nb de vote : {user.nbDeVote}</h4>
                    </li>
                    )}
                </ul>
                <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>         
            </div>
                )
            }
            else{
                return(
                    <div className="container">
                        <h1>vous avez répondu : {this.state.reponse}</h1>
                        <br/>
                        <h3>personne qui on voté : {this.state.compteurVote}/{this.state.users.length} </h3>
        
        
        
                    </div>
                    
        
                    )

            }
        }
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