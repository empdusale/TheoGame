let games = [];


function getAllGames(){
    return games;
}

function getGame(gameId){
    let game = games.find(game => game.gameId === gameId);
    return game;
}

function createGame(gameId){
    let game = {
        gameId : roomId,
        users : []
    }
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

function deletteUserToRoom(userId,gameId){
    let game = games.find(game => game.gameId === gameId);
    let index = game.users.findIndex(user => user.id === userId);
    game.users.splice(index,1)[0];
}


module.exports = {
    getAllGames,createGame,getUsersGame,deletteGame,addUserToGame,getGame,deletteUserToRoom
}