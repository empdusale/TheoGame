let games = [];
let questions = require('../public/question');
const tailleQuestion = questions.length;


function getAllGames(){
    return games;
}

function getGame(gameId){
    let game = games.find(game => game.gameId === gameId);
    return game;
}

function createGame(gameId){
    let game = {
        gameId : gameId,
        compteurQuestion : 0,
        initQuestion : getQuestion().text,
        currentQuestion : null,
        users : [],
        compteurVote : 0,

    }
    game.currentQuestion = game.initQuestion;
    games.push(game)
    //return room
}
function deletteGame(gameId){
    const index = games.findIndex(game => game.gameId === gameId);
    if (index !== -1){
        return games.splice(index,1)[0];
    }
}

function getUsersGame(gameId){
    let game = games.find(game => game.gameId === gameId);
    return game.users;
    
}
function addUserToGame(user,gameId){
    const index = games.findIndex(game => game.gameId === gameId);
    console.log('indexxxxxx : '+index)
    if(index === -1){
        createGame(gameId)
        let game = games.find(game => game.gameId === gameId);
        game.users.push(user);
    }
    else{
        let game = games.find(game => game.gameId === gameId);
        game.users.push(user);
   }
   
}

function deletteUserToGame(userId,gameId){
    let game = games.find(game => game.gameId === gameId);
    let index = game.users.findIndex(user => user.id === userId);
    game.users.splice(index,1)[0];
}

function getQuestion(){
    let question = questions[Math.floor(Math.random() * (3 - 0 + 1)) + 0];
    console.log('la question est : '+ question.text);
    return question;
}

module.exports = {
    getAllGames,createGame,getUsersGame,deletteGame,addUserToGame,getGame,deletteUserToGame,getQuestion
}