'use strict'
const RTMClient = require('./myRTM');
const Person = require('./person');
const PeopleChecker = require('./peoplechecker');
const Schedule = require('node-schedule');
const fs = require('fs');

const token = fs.readFileSync('../token/token.txt'); 
const rtm = new RTMClient(token);
let attendance;


rtm.start();
