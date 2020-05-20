'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const Schedule = require('node-schedule-tz');
const fs = require('fs');

const token = fs.readFileSync('./token.txt','utf-8'); 
const testChannel = 'D013SPP9MFC';
const rtm = new RTMClient(token);

let userschecker = new UsersChecker([]);

let setUsersCheckerRule = makeScheduleRule({hour : 23, minute : 30, tz : 'Asia/Seoul', dayOfWeek : [0, new Schedule.Range(1,5)]});
let messageAbsentUsersRule = makeScheduleRule({hour : 1, minute : 30, tz : 'Asia/Seoul', dayOfWeek : [0, new Schedule.Range(1,5)]});
//let test_setUsersCheckerRule = makeScheduleRule({minute : 51, tz : 'Asia/Seoul'});
//let test_messageAbsentUsersRule = makeScheduleRule({minute : 50, tz : 'Asia/Seoul'});


setUsersChecker();

/* Test Code
 *(function test_setUsersCheckerJob(test_setUsersCheckerRule, setUsersChecker){
 *    Schedule.scheduleJob(test_setUsersCheckerRule, setUsersChecker);
 *})(test_setUsersCheckerRule, setUsersChecker);
 *
 *(function test_messageAbsentUsersJob(test_messageAbsentUsersRule, messageAbsentUsers){
 *    Schedule.scheduleJob(test_messageAbsentUsersRule, messageAbsentUsers);
 *})(test_messageAbsentUsersRule, messageAbsentUsers);
 */

(function setUsersCheckerJob(setUsersCheckerRule, setUsersChecker){
    Schedule.scheduleJob(setUsersCheckerRule, setUsersChecker);
})(setUsersCheckerRule, setUsersChecker);

(function messageAbsentUsersJob(messageAbsentUsersRule, messageAbsentUsers){
    Schedule.scheduleJob(messageAbsentUsersRule, messageAbsentUsers);
})(messageAbsentUsersRule, messageAbsentUsers);


rtm.on('message', function(event){
    userschecker.attend(event);
    console.log(event.username || event.user);
    if(event.text === 'Hello'){
        rtm.postMessage(testChannel, "Hi! how are you");
    }
    else if(event.text === "Who's absent"){
        messageAbsentUsers();
    }
})

rtm.on('goodbye', function(event){
    rtm.postMessage(testChannel, "Good Bye");
})


rtm.start();

function messageAbsentUsers(){ // 10:30 시작할 함수 
    rtm.postMessage(testChannel, userschecker.checkAbsentUsers());
}

function setUsersChecker(){ //8 : 30시 시작할 함수
    rtm.postMessage(testChannel, "Reset attendance");
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