'use strict'
const PeopleChecker = require('./peoplechecker');

const people = [
    {name : "seongho"},
    {name : "abcdefg"},
    {name : "dongul"},
    {name : "temp"}
]

const peopleChecker = new PeopleChecker(people);

peopleChecker.attend(people[0]);
peopleChecker.attend(people[1]);
peopleChecker.attend(people[2]);


console.log(peopleChecker.checkAbsentPeople());



