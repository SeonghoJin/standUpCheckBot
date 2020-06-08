'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const messageTemplate = require('./js/messagetemplate');
const Schedule = require('node-schedule-tz');
const fs = require('fs');

const token = fs.readFileSync('./token.txt','utf-8'); 
const rtm = new RTMClient(token);
const messagetemplate = new messageTemplate();

const testChannel = 'D013SPP9MFC';
const chatChannel = 'CQPBZNR2S';
const standUpChannel = 'CQN41THKN';

let userschecker = new UsersChecker([]);
let setUsersCheckerRule = makeScheduleRule({hour : 23, minute : 30, tz : 'Asia/Seoul', dayOfWeek :  new Schedule.Range(1,5)});
let messageAbsentUsersRule = makeScheduleRule({hour : 1, minute : 30, tz : 'Asia/Seoul', dayOfWeek :  new Schedule.Range(1,5)});
let FridayAnnouncementRule = makeScheduleRule({hour : 23, minute : 30, dayOfWeek : new Schedule.Range(5)});

function messageTemplateAbsentUsers(){
    let template; 
    let data = {};
    
    data.users = userschecker.checkAbsentUsers();
    if(data.users.length === 0){template = messagetemplate.createNoAbsentMessageTemplate();}
    else{template = messagetemplate.createAbsentMessageTemplate();}

    template = messagetemplate.dataBinding(template,data);

    return template;
}

function messageAbsentUsers(){ // 10:30 시작할 함수
    rtm.postMessage(chatChannel, messageTemplateAbsentUsers());
}

function setUsersChecker(){ // 8 : 30시 시작할 함수
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
                rtm.postMessage(testChannel, "초기화 되었습니다");
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

(function messageCheckUser(){
    rtm.on('message', (event) => {
        if(event.channel == standUpChannel){
        userschecker.attend(event);
        }
    });
})();

(function messageInteraction(){
    rtm.on('message', (event) => {
        if(event.text === 'Hello'){
            rtm.postMessage(event.channel, "Hi! how are you");
        }
        if(event.text === "Who's absent"){
            rtm.postMessage(event.channel, messageTemplateAbsentUsers());
        }
        if(event.text ==="질문해봐"){
            rtm.postQuestion(event.channel, "질문하겠습니다 아무렇게나 대답을 해주세요!")
            .then(function(result){
                rtm.postMessage(event.channel, "당신은" + result + "라고 말씀하셨네요");
            })
        }
    });
})();

setUsersChecker();

rtm.start();