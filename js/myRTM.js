'use strict'
const request = require('request');

module.exports = myRTM;

function myRTM(token){
    this.token = token;
}

myRTM.prototype.start = function(){
    this.request("get",this.uris.start);
}

myRTM.prototype.getChannels = function(){
    this.request("get",this.uris.getChannels);
}

myRTM.prototype.postMessage = function(channel, text){
    this.request("post",this.uris.postMessage,{
        channel : channel,
        text : text
    })
}

myRTM.prototype.getChannelsHistory = function(channel, count){
    this.request("get", this.uris.getChannelsHistory,{
        channel : channel
    })
}

myRTM.prototype.request = function(type, uri, query){
    let newQuery = this.formatQuery(type, uri, query);
    
    request(newQuery,function(error, response, body){
        console.log(body);
    })
    
}

myRTM.prototype.formatQuery = function(type, uri, query){
    let newQuery = {};
    query = query || {};
    
    query.token = this.token;
    newQuery.method = type;
    newQuery.uri = uri;
    newQuery.qs = query;
    console.log(uri);
    return newQuery;
}

myRTM.prototype.uris = {
    start : 'https://slack.com/api/rtm.start',
    getChannels : 'https://slack.com/api/channels.list',
    postMessage : 'https://slack.com/api/chat.postMessage',
    getChannelsHistory : 'https://slack.com/api/channels.history'
}


/*
Test


const token = fs.readFileSync('token2.txt', 'utf-8');
console.log(token);
const rtm = new myRTM(token);
rtm.start();
*/




/*

requsetExample


const options = {
    uri : "https://slack.com/api/rtm.start",
    
    qs : {
        token : 'xoxb-1099856482231-1139484135376-8NiIP1d0GzjzSC5m9wVZlAHbp'
    }

}

request(options, function(err, response, body){
    console.log(response);


})*/