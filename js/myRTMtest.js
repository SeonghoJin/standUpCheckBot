const myRTM = require('./myRTM');
const fs = require('fs');
const WebSocket = require('ws');

const token = fs.readFileSync('../token/token.txt', 'utf-8');
const rtm = new myRTM(token);

rtm.start();








/*
rtm.on('message', function(event){
  console.log(event);
})*/

/*
var wss;

rtm.connect().
   then(function(result){
   console.log(result.url);
   wss = new WebSocket(result.url);   
   wss.on('message', function(event, listener){
     console.log(JSON.parse(event));
   })
   
});
*/

 

