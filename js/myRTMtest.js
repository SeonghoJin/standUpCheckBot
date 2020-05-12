const myRTM = require('./myRTM');
const fs = require('fs');

const token = fs.readFileSync('../token/token.txt', 'utf-8');
const rtm = new myRTM(token);


rtm.start();

rtm.getChannels();

rtm.postMessage('C013B6EM4R3',"HELLO WORLD");

rtm.getChannelsHistory('C013B6EM4R3');
