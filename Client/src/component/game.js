import React, { Component } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;


const ENDPOINT = 'localhost:5000'

class Game extends Component {
    constructor(props) {
        super(props)

        this.setUsers = this.setUsers.bind(this);
        this.setUsersView = this.setUsersView.bind(this)
        this.changeQuestion = this.changeQuestion.bind(this)
        this.setQuestion = this.setQuestion.bind(this);
        this.attenteTest = this.attenteTest.bind(this)
        this.functionBoolAttenteResultat = this.functionBoolAttenteResultat.bind(this)



        this.state = {
            users: [],
            usersView: [],
            usersTrier: [],
            name: "",
            pinGamme: "",
            id : "",
            location: props.location,
            question: "",
            reponse: "",
            aRepondu: false,
            bonus: true,
            compteurVote: 0,
            compteurQuestion: 1,
            compteurQuestionMax: null,
            afficheResultat: false,
            user: {},
            boolAttenteResultat :false,
            messageAttenteResultat : null,
            resultatBonus : "...",


        }
    }
    setUsers(users) {
        this.setState({ users: users })
        console.log('voici les users :')
        console.log(this.state.users)
    }

    setUsersView(users) {
        let copyUser = users;
        const index = copyUser.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            copyUser.splice(index, 1)
            this.setState({ usersView: copyUser })

        }

    }

    setQuestion(question) {
        this.setState({ question: question })
    }
    functionBoolAttenteResultat(){
        this.setState({
            boolAttenteResultat : false,
            resultatBonus : "..."

        })
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

    

    attenteTest(){
        setTimeout(this.functionBoolAttenteResultat, 3000)
        if(this.state.afficheResultat === true){
            this.setState({
                resultatBonus : 'bonus activer'
            })
        }
        else{
            this.setState({
                resultatBonus : 'bonus echoué' 
            })
        }             
    }



    activateBonus(e) {
        console.log('bonusActiver');
        //this.attenteTest();
        
        socket.emit('activateBonus', this.state.pinGamme,this.state.name)
        this.setState({
            bonus: false
        })
    }


    vote(e) {

        console.log('id : ', e.target.value)

        socket.emit('aVoter', { pinGamme: this.state.pinGamme, reponse: e.target.value })
        let user = this.state.users.find(user => user.id === e.target.value)
        this.setState({
            reponse: user.username,
            aRepondu: true,

        })
    }
    goToRoom(e) {
        socket.emit('requetteGoToRoom',this.state.pinGamme);
    }
    

    changeQuestion(e) {
        socket.emit('nextQuestion', this.state.pinGamme);

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

        socket.on('changeAdmin',({socket})=>{
            if(this.state.user.role == 'admin'){
                console.log('nouvelle admin trouver')
                this.setState({
                    id : socket 
                })
            }

        })

        socket.on('goToRoom',()=>{
            window.location = `http://localhost:3000/gameMenu?name=${this.state.name}&room=${this.state.pinGamme}&id=${this.state.id}`

        })

        socket.on('attenteResultat',({message,afficheResultat})=>{
            setTimeout(this.attenteTest, 3000)
            this.setState({
                messageAttenteResultat : message,
                boolAttenteResultat : true,
                afficheResultat:afficheResultat

            })


        })
        socket.on('envoieResultat',({resultatBonus})=>{
            this.setState({
                resultatBonus : resultatBonus
            })
        })

        socket.on('bonnusActiver', (afficheResultat) => {
            this.setState({
                afficheResultat: afficheResultat
            })
        })

        socket.on('getUserTrier', ({ userTrier }) => {
            console.log('USERRRR  TRIERRRRRRRR:')
            console.log(userTrier);
            this.setState({
                usersTrier: userTrier
            })
        })

        socket.on('getCurentQuestion', ({ CurrentQuestion }) => {
            console.log('QUESSSSSTION : ' + CurrentQuestion)
            this.setQuestion(CurrentQuestion)
            this.setState({
                aRepondu: false,
                afficheResultat: false
            })

        }
        )
        socket.on('compteurVote', ({ compteur, users, compteurQuestion }) => {
            this.setState({
                compteurVote: compteur,
                users: users,
                compteurQuestion: compteurQuestion
            })
            console.log('LES USERS PRESNT')
            console.log(this.state.users)

        })
        socket.emit('joinGame', { name, pinGamme ,id})
        socket.on('GamePlayer', ({ pinGamme, usersNew, compteurQuestion, compteurQuestionMax, bonus }) => {
            console.log('User GamePlayer2 ::::: ')
            console.log(usersNew);
            let user = usersNew.find(user => user.id === socket.id);
            this.setUsers(usersNew);
            this.setUsersView(usersNew);
            this.setState({
                compteurQuestion: compteurQuestion,
                compteurQuestionMax: compteurQuestionMax,
                bonus: bonus,
                user: user
            }
            )
        })
    }
    render() {
        if(this.state.boolAttenteResultat === true){
            return (
                <div className="container">
                    <h1>{this.state.messageAttenteResultat} </h1>
                    <br />
            <h3>le resultat est : {this.state.resultatBonus}</h3>
                    <br />
                </div>
            )

        }
        else{
            if (this.state.aRepondu === false) {
                return (
                    <div className="container">
                        <h1>La partie Commence </h1>
                        <br />
                        <h3>{this.state.question}</h3>
                        <br />
                        <ul className="list-group" >{this.state.usersView.map(user =>
                            <li className="list-group-item">
                                <button type="button" className="btn btn-info" value={user.id} onClick={(e) => this.vote(e)} >  {user.username}</button>
                            </li>
                        )}
                        </ul>
                        <h3>Question {this.state.compteurQuestion}/{this.state.compteurQuestionMax}</h3>
                    </div>
                )
            }
            else {
           
                if (this.state.compteurVote === this.state.users.length && this.state.bonus === false) {
                    if (this.state.afficheResultat === false) {
                        if (this.state.user.role === 'admin') {
                            if(this.state.compteurQuestion === this.state.compteurQuestionMax){
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>nb de vote : {user.nbDeVote}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-danger" onClick={(e) => this.goToRoom(e)} >Retour a la room</btn>
                                    </div>
                                )

                            }
                            else{
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>nb de vote : {user.nbDeVote}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                    </div>
                                )

                            }
                            
                        }
                        else {
                            return (
                                <div className="container">
                                    <h1>voici les résultat : </h1>
                                    <br />
                                    <h3>{this.state.question}</h3>
                                    <br />
                                    <ul className="list-group" >{this.state.usersTrier.map(user =>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                            <h4>nb de vote : {user.nbDeVote}</h4>
                                        </li>
                                    )}
                                    </ul>
                                </div>
                            )
                        }
                    }
                    else {
                        if (this.state.user.role === 'admin') {
                            if(this.state.compteurQuestion === this.state.compteurQuestionMax){
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-danger" onClick={(e) => this.goToRoom(e)} >Retour a la room</btn>
                                    </div>
                                )

                            }
                            else{
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                    </div>
                                )

                            }
                            
                        }
                        else {
                            return (
                                <div className="container">
                                    <h1>voici les résultat : </h1>
                                    <br />
                                    <h3>{this.state.question}</h3>
                                    <br />
                                    <ul className="list-group" >{this.state.usersTrier.map(user =>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                            <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                        </li>
                                    )}
                                    </ul>
                                </div>
                            )
                        }
                    }
                }
                else if (this.state.compteurVote === this.state.users.length && this.state.bonus === true) {
                    if (this.state.afficheResultat === false) {
                        if (this.state.user.role === 'admin') {
                            if(this.state.compteurQuestion === this.state.compteurQuestionMax){
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>nb de vote : {user.nbDeVote}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-danger" onClick={(e) => this.goToRoom(e)} >Retour a la room</btn>
                                        <btn type="button" className="btn btn-success" onClick={(e) => this.activateBonus(e)} >Activer le bonus</btn>
                                    </div>
                                )

                            }
                            else{
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>nb de vote : {user.nbDeVote}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                        <btn type="button" className="btn btn-success" onClick={(e) => this.activateBonus(e)} >Activer le bonus</btn>
                                    </div>
                                )

                            }
                            
                        }
                        else {
                            return (
                                <div className="container">
                                    <h1>voici les résultat : </h1>
                                    <br />
                                    <h3>{this.state.question}</h3>
                                    <br />
                                    <ul className="list-group" >{this.state.usersTrier.map(user =>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                            <h4>nb de vote : {user.nbDeVote}</h4>
                                        </li>
                                    )}
                                    </ul>
                                    <btn type="button" className="btn btn-success" onClick={(e) => this.activateBonus(e)} >Activer le bonus</btn>
                                </div>
                            )
                        }
                    }
                    else {
                        if (this.state.user.role === 'admin') {
                            if(this.state.compteurQuestion === this.state.compteurQuestionMax){
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-danger" onClick={(e) => this.goToRoom(e)} >Retour a la room</btn>
                                    </div>
                                )

                            }
                            else{
                                return (
                                    <div className="container">
                                        <h1>voici les résultat : </h1>
                                        <br />
                                        <h3>{this.state.question}</h3>
                                        <br />
                                        <ul className="list-group" >{this.state.usersTrier.map(user =>
                                            <li className="list-group-item">
                                                <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                                <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                            </li>
                                        )}
                                        </ul>
                                        <btn type="button" className="btn btn-warning" onClick={(e) => this.changeQuestion(e)} >Question Suivante</btn>
                                    </div>
                                )

                            }
                            
                        }
                        else {
                            return (
                                <div className="container">
                                    <h1>voici les résultat : </h1>
                                    <br />
                                    <h3>{this.state.question}</h3>
                                    <br />
                                    <ul className="list-group" >{this.state.usersTrier.map(user =>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-info" value={user.username} >  {user.username}</button>
                                            <h4>a été voteé par : {this.formatVoterPar(user.voterPar)}</h4>
                                        </li>
                                    )}
                                    </ul>
                                </div>
                            )
                        }
                    }
                }
                else {
                    return (
                        <div className="container">
                            <h1>vous avez répondu : {this.state.reponse}</h1>
                            <br />
                            <h3>personne qui on voté : {this.state.compteurVote}/{this.state.users.length} </h3>
                        </div>
                    )
                }
            }


        }
        
    }
}


export default Game;