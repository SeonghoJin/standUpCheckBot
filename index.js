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
let announcementRule = makeScheduleRule({hour : 23, minute : 30, dayOfWeek : new Schedule.Range(1,5)});

function messageTemplateAbsentUsers(){
    let template; 
    let data = {};
    
    data.users = userschecker.checkAbsentUsers();
    if(data.users.length === 0){template = messagetemplate.createNoAbsentMessageTemplate();}
    else{template = messagetemplate.createAbsentMessageTemplate();}

    template = messagetemplate.dataBinding(template,data);

    return template;
}
 // 10:30 시작할 함수
function messageAbsentUsers(){
    rtm.postMessage(chatChannel, messageTemplateAbsentUsers());
}

//금요일 8:30 공지를 도와주는 함수
function announcement(){
    rtm.postQuestion(testChannel,messagetemplate.questionTemplate())
    .then(function(result){
        let res = Number(result);
        if(res === 0){
            rtm.postMessage(testChannel, "공지안함을 선택하셨습니다.\n");
        }
        else if(res === 1){
            rtm.postQuestion(testChannel, "직접 작성하시기로 선택하셨습니다. 저에게 보낼 공지를 메세지로 보내주세요.\n")
            .then(function(result){
                return rtm.postQuestion(testChannel, result + '\n이렇게 보내겠습니다.')
            })
            .then(function(result){
                noticeMessageCheck(result);
            })
        }
        else if(res <= messagetemplate.templates.length){
            rtm.postQuestion(testChannel, messagetemplate.templates[res] + '이렇게 공지하겠습니다.\n')
            .then(function(result){
                noticeMessageCheck(result);
            })
        }
        else{
            rtm.postMessage(testChannel, "잘못 선택하셨습니다. 다시선택해주십시요\n")
            .then(function(){
                announcement();
            })
        }
    })
}
// 8 : 30시 시작할 함수
function setUsersChecker(){     
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
            });
}

function noticeMessageCheck(result){
    if(result == '응' || result === '그래'){
        rtm.postMessage(testChannel,'보냈습니다');
        }
        else{
            announcement();
        }
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

(function announcementJob(announcementRule, announcement){
    Schedule.scheduleJob(announcementRule,announcement);
})(announcementRule,announcement);

(function messageCheckUser(){
    rtm.on('message', (event) => {
        if(event.channel == standUpChannel){
        userschecker.attend(event);
        }
    });
})();

(function messageInteraction(){
    rtm.on('message', (event) => {
        console.log(event.text);
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
        if(event.text ==='공지'){
            announcement();
        }
    });
})();

setUsersChecker();

rtm.start();