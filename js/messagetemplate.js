'use strict'

module.exports = messageTemplate;

function messageTemplate(){

}

messageTemplate.prototype.createAbsentMessageTemplate = function(){
    let template = '';
    template = '오늘 standup지각자는'
             + ' {{users}} '
             + '입니다';
    return template;
}

messageTemplate.prototype.createNoAbsentMessageTemplate = function(){
    let template = '오늘 stadnup지각자는 없습니다.'
    return template;
}

messageTemplate.prototype.createFridayNoticeTemplate = function(){
    let template = '내일은 이번 사이클의 마지막 단계인 relection발표날입니다.'
                 + '이번 사이클동안 공부하신 내용을 잘 정리하여 발표해주시길 바랍니다!'
                 +'회의 장소는 투표 결과대로 내일 오전 9시 공7 팬도로시 2층에서 뵙겠습니다!공지늦어서 죄송합니다.'
    
    return template;
}
     

messageTemplate.prototype.dataBinding = function(template, data){
     for(let attri in data){
       if(Array.isArray(data[attri])){
            let chdata = '';
            chdata = data[attri].join(',');
            template = template.replace('{{' + attri + '}}', chdata);
        }
        else{
            template.replace('{{'+attri+'}}', data[attri]);
        };
    }
    
    return template;
}