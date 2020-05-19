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
                if(event.type === 'goodbye'){
                    _this.start();
                }
                event = JSON.parse(event);
                console.log(event.type);
                _this.execute(event);
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
    this.events[event] = callback;
}

myRTM.prototype.execute = function(event){
    let _this = this;
    if(event.type === null || _this.events[event.type] == undefined){
       return;
    }
    _this.events[event.type](event);
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
    
    console.log(uri);
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


