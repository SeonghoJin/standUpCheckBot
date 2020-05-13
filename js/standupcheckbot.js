'use strict'
const RTMClient = require('./myRTM');
const Person = require('./user');
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
        result.members.forEach(x => {
            userList.push()
        })
    })

rtm.start();



