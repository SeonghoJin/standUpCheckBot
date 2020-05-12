
const fs = require('fs');
const myRTM = require('./myRTM');
const token = fs.readFileSync('../token/token.txt', 'utf-8');

const RTM = new myRTM(token);
