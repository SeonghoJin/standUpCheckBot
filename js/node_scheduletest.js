'use strict'

const Schedule = require('node-schedule');

const rule = new Schedule.RecurrenceRule();

rule.second = 1;
rule.dayOfWeek = [0, new Schedule.Range(1, 5)]; 

const jobstart = Schedule.scheduleJob(rule, () => {
    console.log("start");
})