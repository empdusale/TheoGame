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

function getAllRoom(){
    let rooms = [];
    users.map(user => {
        let index = rooms.indexOf(user.room);
        if (index === -1){
            rooms.push(user.room)
        }
    })
    return rooms
}

function getUser(id){
    return user.find(user => user.id === id)
}
function getAllUser(){
    return users;
}

module.exports = { addUser,getUser,getRoomUsers,deletteUser,getAllRoom,getAllUser}