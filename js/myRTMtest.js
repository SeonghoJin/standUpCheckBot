'use strict'
const myRTM = require('./myRTM');
const fs = require('fs');
const WebSocket = require('ws');

const token = fs.readFileSync('../token/token.txt', 'utf-8');
const rtm = new myRTM(token);

rtm.usersList().then(function(result){
  console.log()
})


 

