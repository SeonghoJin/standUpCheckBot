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