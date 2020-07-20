const {addRoom,getAllRoom,getUsersRoom} =  require('./room');

let users = [];


function addUser(id,username,room) {
    let user ={
        id,
        username,
        room
    }

    users.push(user);
    return user;

}
function deletteUser(id){
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index,1)[0];
    }
}

function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

function getUser(id){
    return user.find(user => user.id === id)
}

module.exports = { addUser,getUser,getRoomUsers,deletteUser}