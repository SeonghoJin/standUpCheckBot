'use strict'
const RTMClient = require('./myRTM');
const User = require('./user');
const UsersChecker = require('./userchecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('../token/token.txt'); 
const rtm = new RTMClient(token);

let userschecker;

setUsersChecker()
    .then(function(){
        messageCheckAbsentUsers();
    });

rtm.on('message', function(event){
    userschecker.attend(event.user);
})

rtm.start();

function messageCheckAbsentUsers(){ // 10:30 시작
    rtm.postMessage('D0135SFM8RL', JSON.stringify(userschecker.checkAbsentUsers()));
}

function setUsersChecker(){ //8 : 30시 시작
    console.log("succes setting attendances");
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
            })
}

function getUserList(){
    return rtm.usersList()
            .then(function(result){
                console.log(result);
                return result.members.filter(x => !(x.is_bot || x.is_app_user)).map(x => new User(x))
            })
}
