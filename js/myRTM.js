'use strict'
const request = require('request');

module.exports = myRTM;

function myRTM(token){
    this.token = token;
}

myRTM.prototype.start = function(){
    this.request(this.urls.start);
}

myRTM.prototype.request = function(query){
    let newQuery = this.formatQuery(query);
    
    request.get(newQuery, function(error, response, body){
        console.log(response);
    })
}

myRTM.prototype.formatQuery = function(uri, query){
    let newQuery = {};
    query = query || {};
    
    query.token = this.token;
    newQuery.uri = uri;
    newQuery.qs = query;
    console.log(newQuery);
    return newQuery;
}

myRTM.prototype.urls = {
    start : 'https://slack.com/api/rtm.start'
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