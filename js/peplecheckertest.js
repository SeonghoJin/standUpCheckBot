'use strict'
const peopleChecker = require('./peoplechecker');

const people = [
    {name : "seongho"},
    {name : "abcdefg"},
    {name : "dongul"},
    {name : "temp"}
]

const attendancecheker = new peopleChecker(people);

attendancecheker.attend(people[0]);
attendancecheker.attend(people[1]);
attendancecheker.attend(people[2]);
attendancecheker.attend(people[3]);

console.log(attendancecheker.checkAbsentPeople());



