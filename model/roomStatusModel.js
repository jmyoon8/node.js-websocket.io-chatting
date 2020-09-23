
const mg = require('mongoose');//mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
var autoIncrement  = require('mongoose-auto-increment');

//몽고DB연결
let DBURL="mongodb+srv://test:test@test.3qxcs.mongodb.net/chatDB?retryWrites=true&w=majority"
const connection=mg.createConnection(DBURL,{useUnifiedTopology: true, useNewUrlParser: true})

//시퀀스 사용하도록 허용
mg.set('useCreateIndex', true);

autoIncrement.initialize(connection)

const StatusSchema=mg.Schema({

   
    doctor:{
        //닥터가 해당방에 들어와있으면 1 없으면 0
        type:Number
    },
    guest:{
        //손님이 
        type:Number
    }
})

StatusSchema.plugin(autoIncrement.plugin,{
    model:"codeModel",
    field:"roomCode",//손님이 챗팅창에 들어가면 룸코드를 발생시킨다.->방이생김
    startAt : 1,//시작
    increment :1 //1씩 증가
});

const StatusModel=mg.model("roomStatusModel",StatusSchema);

module.exports={StatusModel}