'use strict'
const RTMClient = require('./myRTM');
const User = require('./user');
const PeopleChecker = require('./peoplechecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('../token/token.txt'); 
const rtm = new RTMClient(token);

let attendance;
let userList = [];


rtm.on('message', function(event){
    console.log(event.user);
})


rtm.usersList()
    .then(function(result){
        userList = result.members.filter(x => {
            return !(x.is_bot || x.is_app_user);
        })
        .map(x => {
            return new User(x);
        })
        console.log(userList);
    })

rtm.start();



