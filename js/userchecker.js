'use strict'

module.exports = UsersChecker;

function UsersChecker(users){
    let _this = this
    _this.count = users.length;
    _this.attendance = {};
    _this.ABSENT = 0;
    _this.ATTEND = 1;

    users.forEach(user => {
        _this.attendance[user.id] = {isAttend : _this.ABSENT, name : user.name};        
    })
}

UsersChecker.prototype.attend = function(user){
    let _this = this;
    if(_this.attendance[user.id] === undefined)return;
    _this.attendance[user.id].isAttend = _this.ATTEND;
}

UsersChecker.prototype.checkAbsentUser = function(){
    let _this = this;
    let absentUser = [];
    for(const id in _this.attendance){
        if(_this.attendance[id].isAttend === _this.ABSENT)absentUser.push(_this.attendance[id].name);
    }
    return absentUser;
}