let rooms = [];

function getAllRoom(){
    return rooms;
}

function addRoom(roomId){
    let room = {
        roomId,
        users : []
    }
    rooms.push(room)
    return room
}

function getUsersRoom(roomId){
    let room = rooms.find(room => room.id === roomId);
    return room.users;
    
}

module.exports = {
    getAllRoom,addRoom,getUsersRoom
}