'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('./token/token.txt'); 
const testChannel = 'D0135SFM8RL';
const rtm = new RTMClient(token);

let userschecker = new UsersChecker([]);
let setUsersCheckerRule = makeScheduleRule({hour : 8, minute : 30});
let messageAbsentUsersRule = makeScheduleRule({hour : 10, minute : 30});
let test_setUsersCheckerRule = makeScheduleRule({minute : 51});
let test_messageAbsentUsersRule = makeScheduleRule({minute : 50});

setUsersChecker();

(function test_setUsersCheckerJob(test_setUsersCheckerRule, setUsersChecker){
    Schedule.scheduleJob(test_setUsersCheckerRule, setUsersChecker);
})(test_setUsersCheckerRule, setUsersChecker);

(function test_messageAbsentUsersJob(test_messageAbsentUsersRule, messageAbsentUsers){
    Schedule.scheduleJob(test_messageAbsentUsersRule, messageAbsentUsers);
})(test_messageAbsentUsersRule, messageAbsentUsers);


(function setUsersCheckerJob(setUsersCheckerRule, setUsersChecker){
    Schedule.scheduleJob(setUsersCheckerRule, setUsersChecker);
})(setUsersCheckerRule, setUsersChecker);

(function messageAbsentUsersJob(messageAbsentUsersRule, messageAbsentUsers){
    Schedule.scheduleJob(messageAbsentUsersRule, messageAbsentUsers);
})(messageAbsentUsersRule, messageAbsentUsers);



rtm.on('message', function(event){
    userschecker.attend(event.user);
    if(event.text === 'Hello'){
        rtm.postMessage(testChannel, "Hi! How are you");
    }
    else if(event.text === 'Who absent'){
        messageAbsentUsers();
    }
})


rtm.start();

function messageAbsentUsers(){ // 10:30 시작할 함수 
    rtm.postMessage(testChannel, userschecker.checkAbsentUsers() + " " + new Date());
}

function setUsersChecker(){ //8 : 30시 시작할 함수a
    rtm.postMessage(testChannel, "reset attendance" + " " + new Date());
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