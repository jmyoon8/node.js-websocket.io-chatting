
const mongoose = require('mongoose');//mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
var autoIncrement  = require('mongoose-auto-increment');

//몽고DB연결
let DBURL="mongodb+srv://test:test@test.3qxcs.mongodb.net/chatDB?retryWrites=true&w=majority"
const connection=mongoose.createConnection(DBURL,{useUnifiedTopology: true, useNewUrlParser: true})

//시퀀스 사용하도록 허용
mongoose.set('useCreateIndex', true);

autoIncrement.initialize(connection)

const StatusSchema=mongoose.Schema({
    
    roomCode:{
        //룸코드가 자동으로 생성될 필드(시퀀스로)
        type:Number
    },
    section:{
        type:String
    },
    doctor:{
        //닥터가 방에있으면 아이디생성
        type:String
    },
    guest:{
        //손님이 방에있으면 아이디생성
        type:String
        
    },
    guestIO:{
        type:Number
    },
    lflLength:{
        type:Number
        
    
    }
})

StatusSchema.plugin(autoIncrement.plugin,{
    model:"codeModel",
    field:"roomCode",//손님이 챗팅창에 들어가면 룸코드를 발생시킨다.->방이생김
    startAt : 1,//시작
    increment :1 //1씩 증가
});

const StatusModel=mongoose.model("roomStatusModel",StatusSchema);

module.exports={StatusModel}