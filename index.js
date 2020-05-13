'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('./token/token.txt'); 
const rtm = new RTMClient(token);

let userschecker = new UsersChecker([]);
let setUsersCheckerRule = makeScheduleRule({minute : 51});
let messageAbsentUsersRule = makeScheduleRule({minute : 50});

(function setUsersCheckerJob(setUsersCheckerRule, setUsersChecker){
    Schedule.scheduleJob(setUsersCheckerRule, setUsersChecker);
})(setUsersCheckerRule, setUsersChecker);

(function messageAbsentUsersJob(messageAbsentUsersRule, messageAbsentUsers){
    Schedule.scheduleJob(messageAbsentUsersRule, messageAbsentUsers);
})(messageAbsentUsersRule, messageAbsentUsers);


rtm.on('message', function(event){
    userschecker.attend(event.user);
})


rtm.start();

function messageAbsentUsers(){ // 10:30 시작할 함수 
    rtm.postMessage('D0135SFM8RL', JSON.stringify(userschecker.checkAbsentUsers()));
}

function setUsersChecker(){ //8 : 30시 시작할 함수
    rtm.postMessage('D0135SFM8RL', "reset attendance");
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
            });
}

function getUserList(){
    return rtm.usersList()
            .then(function(result){
                return result.members.filter(x => !(x.is_bot || x.is_app_user)).map(x => new User(x))
            });
}

function makeScheduleRule(date){
    let rule = new Schedule.RecurrenceRule();
    for(let i in date){
        rule[i] = date[i];
    }
    return rule;
}