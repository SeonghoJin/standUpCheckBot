'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const Schedule = require('node-schedule-tz');
const fs = require('fs');

const token = fs.readFileSync('./token.txt','utf-8'); 
const testChannel = 'CQPBZNR2S';
const rtm = new RTMClient(token);

let userschecker = new UsersChecker([]);

let setUsersCheckerRule = makeScheduleRule({hour : 23, minute : 30, tz : 'Asia/Seoul', dayOfWeek : [0, new Schedule.Range(1,5)]});
let messageAbsentUsersRule = makeScheduleRule({hour : 1, minute : 30, tz : 'Asia/Seoul', dayOfWeek : [0, new Schedule.Range(1,5)]});

function messageAbsentUsers(){ // 10:30 시작할 함수 
    rtm.postMessage(testChannel, userschecker.checkAbsentUsers());
}

function setUsersChecker(){ //8 : 30시 시작할 함수
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
            });
}

function getUserList(){
    return rtm.usersList()
            .then(function(result){
                return result.members.filter(x =>(x.tz !== null && x.tz !== undefined && x.tz === 'Asia/Seoul') && !(x.is_bot || x.is_app_user)).map(x => new User(x))
            });
}

function makeScheduleRule(date){
    let rule = new Schedule.RecurrenceRule();
    for(let i in date){
        rule[i] = date[i];
    }
    return rule;
}

(function setUsersCheckerJob(setUsersCheckerRule, setUsersChecker){
    Schedule.scheduleJob(setUsersCheckerRule, setUsersChecker);
})(setUsersCheckerRule, setUsersChecker);

(function messageAbsentUsersJob(messageAbsentUsersRule, messageAbsentUsers){
    Schedule.scheduleJob(messageAbsentUsersRule, messageAbsentUsers);
})(messageAbsentUsersRule, messageAbsentUsers);

setUsersChecker();

rtm.on('message', function(event){
    userschecker.attend(event);
    if(event.text === 'Hello'){
        rtm.postMessage(event.channel, "Hi! how are you");
    }
    else if(event.text === "Who's absent"){
        rtm.postMessage(event.channel, userschecker.checkAbsentUsers());
    }
})

rtm.start();

