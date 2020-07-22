let rooms = [];


function getAllRoom(){
    return rooms;
}

function getRoom(roomId){
    let room = rooms.find(room => room.roomId === roomId);
    return room;
}

function addRoom(roomId){
    let room = {
        roomId : roomId,
        users : []
    }
    rooms.push(room)
    //return room
}
function deletteRoom(roomId){
    const index = rooms.findIndex(room => room.roomId === roomId);
    if (index !== -1){
        return rooms.splice(index,1)[0];
    }
}

function getUsersRoom(roomId){
    let room = rooms.find(room => room.roomId === roomId);
    return room.users;
    
}
function addUserToRoom(user,roomId){
    const index = rooms.findIndex(room => room.roomId === roomId);
    if(index === -1){
        addRoom(roomId);
        let room = rooms.find(room => room.roomId === roomId);
        room.users.push(user);
    }
    else{
        let room = rooms.find(room => room.roomId === roomId);
        room.users.push(user);
   }
   
}

function deletteUserToRoom(userId,roomId){
    let room = rooms.find(room => room.roomId === roomId);
    let index = room.users.findIndex(user => user.id === userId);
    room.users.splice(index,1)[0];
}


module.exports = {
    getAllRoom,addRoom,getUsersRoom,deletteRoom,addUserToRoom,getRoom,deletteUserToRoom
}