const moment = require('moment');

// Let users empty array
let users = [];
let messagesArr = [];

// Add user to array of users
function userJoin(id, username, room){
    const user = {id, username, room};
    // Push the new user inside the array
    users.push(user);
    // Return the user
    return user;
}
// Add message inside the array
function addMessage(username, msg, room){
    let time = moment().format('h:mm a');
    let message = {user:username, text:msg, time, room};
    // Check array message length
    // console.log(messagesArr.length)
    if(messagesArr.length > 1000){
        messagesArr.length = 0;
        messagesArr.push(message);
        return messagesArr
    }
    messagesArr.push(message);
    // console.log(messagesArr)
    return messagesArr
}
// Get messages
function getMessages(room){
    // Return only messages from specific room
    return messagesArr.filter(messages => messages.room === room);
}

// Get current user
function getCurrentUser (id){
    return users.find(user => user.id === id);
}

// User leaves chat 
function userLeave(id){
    // find user index 
    let index = users.findIndex(user => user.id === id);
    // Remove user leaved from the index
    if(index !== -1){
    return users.splice(index, 1)[0];
    }
}

// Get room users 
function getRoom(room){
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoom,
    addMessage,
    getMessages
}