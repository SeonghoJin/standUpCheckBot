'use strict'

module.exports = UsersChecker;

function UsersChecker(users){
    let _this = this
    _this.count = users.length;
    _this.attendance = {};
    _this.usersName = {};
    _this.userId = {};
    _this.ABSENT = 0;
    _this.ATTEND = 1;

    users.forEach(user => {
        _this.attendance[user.id] = _this.ABSENT;        
        _this.usersName[user.id] = user.name;
        _this.userId[user.name] = user.id;
    })
}

UsersChecker.prototype.attend = function(event){
    let _this = this;
    let id = event.user || _this.userId[event.username];
    if(_this.attendance[id] !== undefined)_this.attendance[id] = _this.ATTEND;
}

UsersChecker.prototype.checkAbsentUsers = function(){
    let _this = this;
    let absentUser = [];
    for(const id in _this.attendance){
        if(_this.attendance[id] === _this.ABSENT)absentUser.push(_this.usersName[id]);
    }
    return absentUser;
}