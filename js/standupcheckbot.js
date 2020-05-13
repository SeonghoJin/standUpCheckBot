'use strict'
const RTMClient = require('./myRTM');
const User = require('./user');
const UsersChecker = require('./userchecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('../token/token.txt'); 
const rtm = new RTMClient(token);

let userschecker;

setUsersChecker();

rtm.on('message', function(event){
    console.log(event.user);
})


    

rtm.start();



function setUsersChecker(){
    return getUserList()
        .then(function(users){
            userschecker = new UsersChecker(users);
        })
}

function getUserList(){
    return rtm.usersList()
            .then(function(result){
                return result.members.filter(x => !(x.is_bot || x.is_app_user)).map(x => new User(x))
            })
}
