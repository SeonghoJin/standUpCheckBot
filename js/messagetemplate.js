'use strict'

module.exports = messageTemplate;

function messageTemplate(){
    const templates = [];
    templates.push("공지안함\n");
    templates.push("직접 작성\n");
    templates.push(this.createNoticeRunningTemplate());
    templates.push(this.createNoticeReflectionTemplate());
    templates.push(this.createNoticeUploadRunningPlan());
    templates.push(this.createNoticeReflectionPlan());
    this.templates = templates;
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

messageTemplate.prototype.createNoticeRunningTemplate = function(){
    let template = '내일은 일주일만에 모이는 study 하는 날입니다.\n'
                 + '일주일동안 공부하신 내용을 내일까지 정리해주시길 바랍니다.\n'
                 + '오전 9시 공7 팬도로시 2층에서 뵙겠습니다!\n'
    
    return template;
}

messageTemplate.prototype.createNoticeReflectionTemplate = function(){
    let template = '내일은 이번 사이클의 마지막 단계인 relection발표날입니다.\n'
                 + '이번 사이클동안 공부하신 내용을 잘 정리하여 발표해주시길 바랍니다!\n'
                 + '회의 장소는 오전 9시 공7 팬도로시 2층입니다\n'
    
    return template;
}

messageTemplate.prototype.createNoticeUploadRunningPlan = function(){
    let template = '오늘까지 러닝 계획을 업로드해주세요!\n';
    return template;
}

messageTemplate.prototype.createNoticeReflectionPlan = function(){
    let template = '오늘까지 reflection 계획을 업로드해주세요!\n';
    return template;
}

messageTemplate.prototype.questionTemplate = function(){
    let _this = this;
    let template = '어떤 것을 공지하시겠습니까?\n'
    for(let i = 0; i < this.templates.length; i++){
        template += i+'.\n' + _this.templates[i] + '\n'; 
    }
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