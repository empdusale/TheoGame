let users = [];


function addUser(id,username,room) {
    let user ={
        id,
        username,
        room,
        voteFor: null,
        voterPar : [], 
        nbDeVote: 0,
        bonus : true,
        inGame : false,
        role : null,
        aVoter : false
        
    }
    users.push(user);
    console.log('users add')
    console.log(users)
    return user;

}
function deletteUser(id){
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index,1)[0];
    }
}



function getUser(id){
    let user = users.find(user => user.id === id)
    return user;
}
function getAllUser(){
    return users;
}

module.exports = { addUser,getUser,deletteUser,getAllUser}