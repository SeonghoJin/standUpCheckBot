'use strict'
const request = require('request');
const WebSocket = require('ws');
module.exports = myRTM;

function myRTM(token){
    this.token = token;
    this.ws = null;
    this.events = {};
}

myRTM.prototype.start = function(){
    let _this = this;
    return this.request("get", this.uris.start)
        .then(function(result){
            return _this.connect();
        })
        .then(function(result){
            _this.ws = new WebSocket(result.url);
            _this.ws.on('message',function(event, listener){
                event = JSON.parse(event);
                if(event.type === 'goodbye'){
                    _this.start();
                }else{
                console.log(event.type);
                _this.execute(event);
                }
            })
        })
}

myRTM.prototype.connect = function(){
    return this.request("get", this.uris.connect);
}

myRTM.prototype.getChannels = function(){
    return this.request("get", this.uris.getChannels);
}

myRTM.prototype.postMessage = function(channel, text){
    return this.request("post", this.uris.postMessage,{
        channel : channel,
        text : text
    })
}

myRTM.prototype.postQuestion = function(channel, text){
    let _this = this;
    return new Promise(function(resolve, reject){
        _this.postMessage(channel,text)
        .then(function(){
            _this.on('message',function(event){
            if(event.channel == undefined || event.channel === null)return;
            if(event.channel === channel){
                _this.eraseEventListner('message');
                resolve(event.text);
            }
        })
    })
    })
}

myRTM.prototype.getChannelsHistory = function(channel, count){
    return this.request("get", this.uris.getChannelsHistory,{
        channel : channel,
        count : count
    })
}

myRTM.prototype.usersList = function(){
    return this.request("get", this.uris.usersList);
}

myRTM.prototype.on = function(event, callback){
    this.events = this.events || {};
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
}

myRTM.prototype.execute = function(event){
    let _this = this;
    if(event.type === null || _this.events[event.type] == undefined){
       return;
    }
    _this.events[event.type].forEach(execfunction => {
        execfunction(event);
    });
}

myRTM.prototype.eraseEventListner = function(event){
    let _this = this; 
    if(_this.events[event] == undefined || _this.events[event].length === 0){
       return;
    }
    _this.events[event].pop();
}

myRTM.prototype.request = function(type, uri, query){
    let newQuery = this.formatQuery(type, uri, query);
    
    return new Promise(function(resolve, reject){
        request(newQuery,function(error,response,body){
            resolve(body);      
        })
    })
}

myRTM.prototype.formatQuery = function(type, uri, query){
    let newQuery = {};
    query = query || {};
    
    query.token = this.token;
    newQuery.method = type;
    newQuery.uri = uri;
    newQuery.qs = query;
    newQuery.json = true;
    
    return newQuery;
}

myRTM.prototype.uris = {
    start : 'https://slack.com/api/rtm.start',
    getChannels : 'https://slack.com/api/channels.list',
    postMessage : 'https://slack.com/api/chat.postMessage',
    getChannelsHistory : 'https://slack.com/api/channels.history',
    connect : 'https://slack.com/api/rtm.connect',
    usersList : 'https://slack.com/api/users.list'
}


