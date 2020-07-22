let users = [];


function addUser(id,username,room) {
    let user ={
        id,
        username,
        room
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
    console.log('users :')
    console.log(users)
    console.log(id)
    let user = users.find(user => user.id === id)
    console.log('USSSERR :')
    console.log(user)
    return user;
}
function getAllUser(){
    return users;
}

module.exports = { addUser,getUser,deletteUser,getAllUser}