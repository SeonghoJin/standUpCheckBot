'use strict'
const request = require('request');

module.exports = myRTM;

function myRTM(token){
    this.token = token;
}

myRTM.prototype.start = function(){
    return this.request("get", this.uris.start);
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
        channel : channel
    })
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
    connect : 'https://slack.com/api/rtm.connect'
}


