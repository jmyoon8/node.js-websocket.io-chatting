//스키마 몽고 db에 들어갈 데이터의 무결성을 지정해준다.

/*
스키마 종류
String, Number, Date, Buffer ,Boolean, Mixed, ObjectId, Array

*/
const mg = require('mongoose');//mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
const sequence = require('mongoose-auto-increment');

//몽고DB연결
var DBURL="mongodb+srv://test:test@test.3qxcs.mongodb.net/chatDB?retryWrites=true&w=majority"
let connection=mg.createConnection(DBURL,{ useNewUrlParser: true,useUnifiedTopology: true});

mg.set('useCreateIndex', true);
sequence.initialize(connection)

let logSchema=mg.Schema({
    name:{
        //어떤 과의 의사선생인지, 손님인지 채크
        type:String ,
    },
    message:{
        //챗팅 매새지
        type:String
    },
    data:{
        //챗팅 입력 날짜
        type:Date
    },
    Status:{
        //읽었는지않읽었는지 상태 (의사가 방에 들어오면 사라짐)
        type:Number
    }
    
});

logSchema.plugin(sequence.plugin,{
    model:"codeModel",
    field:"roomCode",
    startAt : 1,//시작
    increment :1 //1씩 증가
});

//스키마를 모델(모델은 스키마담아주는 역할)로 감싸준다.
const logModel=mg.model('logSchema',logSchema)
//module.exports는 스키마를 다른곳에서도 상요할 수 있도록 하는 기능이다

module.exports={logModel}

