'use strict'
const RTMClient = require('./js/myRTM');
const User = require('./js/user');
const UsersChecker = require('./js/userchecker');
const messageTemplate = require('./js/messagetemplate');
const {createEventAdapter} = require('@slack/events-api');
const Schedule = require('node-schedule-tz');
const fs = require('fs');

const token = fs.readFileSync('./token.txt','utf-8'); 
const signing_secret = fs.readFileSync('./signing_secret.txt','utf-8');
const slackEvents = createEventAdapter(signing_secret);
const port = process.env.PORT || 3000;
const web = new RTMClient(token);
const messagetemplate = new messageTemplate();

const testChannel = 'D014D41FCQL';
const chatChannel = 'CQPBZNR2S';
const standUpChannel = 'CQN41THKN';

let userschecker = new UsersChecker([]);
let setUsersCheckerRule = makeScheduleRule({/*hour : 23, minute : 30,*/ second : 1, tz : 'Asia/Seoul', dayOfWeek :  new Schedule.Range(1,5)});
let messageAbsentUsersRule = makeScheduleRule({hour : 1, minute : 30, tz : 'Asia/Seoul', dayOfWeek :  new Schedule.Range(1,5)});

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
    web.postMessage(chatChannel, messageTemplateAbsentUsers());
}

function setUsersChecker(){ // 8 : 30시 시작할 함수
    return getUserList()
            .then(function(users){
                userschecker = new UsersChecker(users);
                web.postMessage(testChannel, "setting");
            });
}

function getUserList(){
    return web.usersList()
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

slackEvents.on('message', (event) => {
    console.log(event);
    if(event.channel == standUpChannel){
        userschecker.attend(event);
    }
    if(event.text === 'Hello'){
        web.postMessage(event.channel, "Hi! how are you");
    }
    if(event.text === "Who's absent"){
        web.postMessage(event.channel, messageTemplateAbsentUsers());
    }
});

slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});



