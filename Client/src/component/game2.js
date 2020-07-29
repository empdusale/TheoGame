import React, { Component } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;


const ENDPOINT = 'localhost:5000'

class Game2 extends Component {
    constructor(props) {
        super(props)

        this.setUsers = this.setUsers.bind(this);    
        this.changeQuestion = this.changeQuestion.bind(this)
        this.setQuestion = this.setQuestion.bind(this);
        this.setResultat = this.setResultat.bind(this)
        


        this.state = {
            users: [],
            name: "",
            pinGamme: "",
            id : "",
            location: props.location,
            question: "",
            aRepondu: false,
            compteurVote: 0,
            compteurQuestion: 1,
            compteurQuestionMax: null,
            user: {},
            userQ1 : [],
            userQ2 : [],
            boolResultat : false

        }
    }
    componentDidMount() {
        var { name, pinGamme ,id} = queryString.parse(this.state.location.search);

        socket = io(ENDPOINT)

        this.setState({
            name: name,
            pinGamme: pinGamme,
            id:id
        })
        
        socket.on('ResetUserLeave',({users,compteurQuestion,compteurQuestionMax})=>{
            console.log('Test User')
            console.log('User Trierrr Client ::::: ');
            console.log(users)
            let user = users.find(user => user.id == socket.id)
            this.setState({
                users:users,
                compteurQuestion: compteurQuestion,
                compteurQuestionMax : compteurQuestionMax,
                user : user,
            })
            this.setUsersView(this.state.users);
            
        })
        socket.on('getUserChange',({users})=>{
            this.setState({
                users:users
            })
            let user = users.find(user => user.id == socket.id)
            this.setState({
                user:user
            })
            
        })

        socket.on('changeAdmin',({socket})=>{
            console.log('entrer dans change admin')
            if(this.state.user.role == 'admin'){
                console.log('nouvelle admin trouver')
                this.setState({
                    id : socket 
                })
                console.log('nouvelle id : '+this.state.id)
            }
        })

        socket.on('goToRoom',()=>{
            window.location = `http://localhost:3000/gameMenu?name=${this.state.name}&room=${this.state.pinGamme}&id=${this.state.id}`

        })

        socket.on('getCurentQuestion', ({ CurrentQuestion }) => {
            console.log('QUESSSSSTION : ' + CurrentQuestion)
            this.setQuestion(CurrentQuestion)
            this.setState({
                boolResultat : false,
                aRepondu: false,
            })

        }
        )
        socket.on('compteurVote', ({ compteur, users, compteurQuestion }) => {
            this.setState({
                compteurVote: compteur,
                users: users,
                compteurQuestion: compteurQuestion
            })
            let user = this.state.users.find(user => user.id == socket.id)
            this.setState({
                user : user
            })
            console.log('LES USERS PRESNT')
            console.log(this.state.users)
            return null;

        })
        socket.emit('joinGame', { name, pinGamme ,id})
        socket.on('GamePlayer', ({ pinGamme, usersNew, compteurQuestion, compteurQuestionMax, bonus }) => {
            console.log('User GamePlayer2 ::::: ')
            console.log(usersNew);
            let user = usersNew.find(user => user.id === socket.id);
            this.setUsers(usersNew);
            this.setState({
                compteurQuestion: compteurQuestion,
                compteurQuestionMax: compteurQuestionMax,
                user: user
            }
            )
        })
    }
    setResultat(){
        console.log('entrer dans la fonction')
        let usersQ1 = [];
        let usersQ2 = [];
        for(let i = 0 ; i< this.state.users.length;i++){
            if(this.state.users[i].voteFor == 1){
                usersQ1.push(this.state.users[i].username)
            }
            else{
                usersQ2.push(this.state.users[i].username)
            }
        }
        console.log('usersQ1 :: ')
        console.log(usersQ1)
        console.log('usersQ2 :: ')
        console.log(usersQ2)
        this.setState({
            userQ1 : usersQ1,
            userQ2 : usersQ2,
            boolResultat : true
        })


    }

    setUsers(users) {
        this.setState({ users: users })
        console.log('voici les users :')
        console.log(this.state.users)
    }

    setQuestion(question) {
        this.setState({ question: question })
    }

    formatVoterPar(voterParListe){
        var res = ""
        if(voterParListe.length == 1){
            res = voterParListe[0]
        }
        else if( voterParListe.length > 1){
            for(var i = 0;i<voterParListe.length-1;i++){
                res = res + voterParListe[i] + ", "
            }
            res = res + voterParListe[voterParListe.length-1]
        }
        return res;
    }

    vote(e) {

        console.log('Question choisis : ', e.target.value)

        socket.emit('aVoter', { pinGamme: this.state.pinGamme, reponse: e.target.value })
        this.setState({
            aRepondu: true
        })
    }
    goToRoom(e) {
        console.log('IDDDDDD   GO   TO    ROOM  :: '+this.state.id)
        socket.emit('requetteGoToRoom',this.state.pinGamme);
    }
    

    changeQuestion(e) {
        socket.emit('nextQuestion', this.state.pinGamme);

    }
    boutonQuitter(e){
        window.location = `http://localhost:3000/gameMenu?name=${this.state.name}&room=${this.state.pinGamme}`

    }
    
    render() {     
        if (this.state.aRepondu === false) {
            return (
                <div className="container">
                    <h3>Tu Prefere : </h3>
                    <br />
                    <button type="button" className="btn btn-info" value={1} onClick={(e) => this.vote(e)} >  {this.state.question.q1}</button>
                    <br/>
                    <h4>Ou</h4>
                    <br/>
                    <button type="button" className="btn btn-info" value={2} onClick={(e) => this.vote(e)} >  {this.state.question.q2}</button>
                    <br/>
                    <h3>Question {this.state.compteurQuestion}/{this.state.compteurQuestionMax}</h3>
                    </div>
                )
        }
        else {
           
                if (this.state.compteurVote === this.state.users.length && this.state.boolResultat == false) {
                    this.setResultat()
                    return(null)
                    
                }
                else if(this.state.boolResultat == true){
                    if(this.state.user.role == 'admin'){
                        if(this.state.userQ1.length > this.state.userQ2.length){
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-success">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-danger">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6>
                                <br/>
                                <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                </div>
                            )

                        }else if(this.state.userQ1.length < this.state.userQ2.length) {
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-danger">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-success">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6>
                                <br/>
                                <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                </div>
                            )

                        }else{
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-warning">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-warning">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6>
                                <br/>
                                <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                </div>
                            )

                        }

                    }else{
                        if(this.state.userQ1.length > this.state.userQ2.length){
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-success">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-danger">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6> 
                                </div>
                            )

                        }else if(this.state.userQ1.length < this.state.userQ2.length){
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-danger">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-success">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6> 
                                </div>
                            )
                            
                        }
                        else{
                            return(
                                <div className='container'>
                                <h3>Voici les resultat : </h3>
                                <br/>
                                <button type="button" className="btn btn-warning">  {this.state.question.q1}</button>
                                <h6>Nombre de vote : {this.state.userQ1.length}</h6>
                                <br/>
                                <h4>Ou</h4>
                                <br/>
                                <button type="button" className="btn btn-warning">  {this.state.question.q2}</button>
                                <h6>Nombre de vote : {this.state.userQ2.length}</h6> 
                                </div>
                            )

                        }
                        

                    }
                    

                }
                    
                else {
                    return (
                        <div className="container">
                            <h3>personne qui on voté : {this.state.compteurVote}/{this.state.users.length} </h3>
                        </div>
                    )
                }
            }
            
        
    }
}


export default Game2;