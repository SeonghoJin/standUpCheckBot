'use strict'

module.exports = attendanceChecker;

function attendanceChecker(people){
    let _this = this
    _this.count = people.length;
    _this.attendance = {};
    _this.ABSENT = 0;
    _this.ATTEND = 1;

    people.forEach(person => {
        _this.attendance[person.name] = _this.ABSENT;        
    })
}

attendanceChecker.prototype.attend = function(person){
    let _this = this;
    _this.attendance[person.name] = _this.ATTEND;
}

attendanceChecker.prototype.checkAbsentPeople = function(){
    let _this = this;
    let absentPeople = [];
    for(const name in _this.attendance){
        if(_this.attendance[name] === _this.ABSENT)absentPeople.push(name);
    }
    return absentPeople;
}