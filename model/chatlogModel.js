//스키마 몽고 db에 들어갈 데이터의 무결성을 지정해준다.

/*
스키마 종류
String, Number, Date, Buffer ,Boolean, Mixed, ObjectId, Array

*/

const e = require('express');
const mongoose = require('mongoose')

const LogSchema=mongoose.Schema({
    
    doctor:{
        //손님이 상담하고자하는 과선생을 입력
        type:String
    },
    guest:{
        //채팅하는 사람이 어떤 과의 의사선생인지, 손님(guest)인지 채크
        type:String 
    },
    message:{
        //챗팅 매새지
        type:String
    },
    roomCode:{
        //닥터가 어떤 방에 들어가면 그 방의 코드를 DB에 올림
        type:String
    },
    date:{
        //챗팅 입력 날짜
        type:Date
    },
    who:{
        type:String
    },
    lfl:{
        type:Number,
        default:1
    },
    section:{
        type:String
    }
    
});

//스키마를 모델 설정
const LogModel=mongoose.model('chatlogModel',LogSchema)
//module.exports는 스키마를 다른곳에서도 상요할 수 있도록 하는 기능이다

module.exports={LogModel}

