let games = [];
let questions = require('../public/question');
let questionsPrefere = require('../public/questionPrefere')
const tailleQuestion = questions.length;


function getAllGames(){
    return games;
}

function getGame(gameId){
    
    let game = games.find(game => game.gameId === gameId);
    return game;
}

function createGame(gameId,userAdminSocket,nbQuestion,choixJeux){
    copyQuestion = [];
    if(choixJeux == 'game'){
        for (var i = 0; i < questions.length; i++){
            copyQuestion[i] = questions[i];
        }
    }else{
        for (var i = 0; i < questionsPrefere.length; i++){
            copyQuestion[i] = questionsPrefere[i];
        }
    }
    
    let questionMax = parseInt(nbQuestion)
    let game = {
        gameId : gameId,
        compteurQuestion : 1,
        compteurQuestionMax : questionMax,
        currentQuestion : null,
        users : [],
        usersTrier : [],
        compteurVote : 0,
        question: copyQuestion,
        userAdminSocket : userAdminSocket,
        choixGame : choixJeux
        

    }
    console.log('Game ______   Admin  _____ Socket  : '+game.userAdminSocket)
    
    games.push(game)
    getGame(gameId).currentQuestion = getQuestion(gameId)
    console.log('les games :::: ')
    console.log(games)
}
function deletteGame(gameId){
    console.log('GAme DELETTTTTTE')
    
    const index = games.findIndex(game => game.gameId === gameId);
    console.log("Index ::::::::: "+index)
    if (index !== -1){
        return games.splice(index,1)[0];
    }
    console.log('les games :::: ')
    console.log(games)
}

function getUsersGame(gameId){
    let game = games.find(game => game.gameId === gameId);
    return game.users;
    
}

function addUserToGame(user,gameId,id){
    const index = games.findIndex(game => game.gameId === gameId);
    if(index === -1){
        console.log('erreur addUserToGame')
    }
    else{
        let game = games.find(game => game.gameId === gameId);
        if(id == game.userAdminSocket){
            user.role = 'admin'
        }
        game.users.push(user);
   }
   
}

function deletteUserToGame(userId,gameId){
    let game = games.find(game => game.gameId === gameId);
    let index = game.users.findIndex(user => user.id === userId);
    game.users.splice(index,1)[0];
    console.log('USERRRRSS LENGTTTTTT ::::::::::::')
    console.log(game.users.length)
    if(game.users.length <= 0){
        deletteGame(gameId);
    }
}

function getQuestion(gameId){
    let game = getGame(gameId)
    if(game.question.length <= 0){
        let copyQuestion = [];
        for (var i = 0; i < questions.length; i++){
            copyQuestion[i] = questions[i];
        }
        game.question = copyQuestion;
    }
    let nombre = Math.floor(Math.random() * (game.question.length-1 - 0 + 1)) + 0;
    let question = game.question[nombre]
    let index = game.question.indexOf(question)
    game.question.splice(index,1)[0];
    return question;
}
function setUserTrier(pinGamme){
    let game = getGame(pinGamme)
    let taille = game.users.length;
    let users = game.users
    let res = [];
    for(var j = 0;j<taille ; j++){
        res[j] = users[j];
    }
    for(let i = 0;i < taille ; i++){
        for(var x = 0;x < taille-1;x++){
            if(res[x].nbDeVote < res[x+1].nbDeVote){
                let temp = res[x];
                res[x] = res[x+1];
                res[x+1] = temp
            }
        }

    }
    game.usersTrier = res;
    return res;

    
}

module.exports = {
    getAllGames,createGame,getUsersGame,deletteGame,addUserToGame,getGame,deletteUserToGame,getQuestion,setUserTrier
}