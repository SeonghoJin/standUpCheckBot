var fs = require('fs');
const { RTMClient, WebClient } = require('@slack/client');
var weather = require('weather-js');
var token;
var rtm;
var web;


token = fs.readFileSync('../token/token2.txt', 'utf8');

rtm = new RTMClient(token);
web = new WebClient(token);

rtm.on('message', function(event){
    console.log(event);
})

rtm.on('channel_joined', function(event){
    
})

rtm.on('chaanel_created', function(event){
    
})
rtm.start();
	
