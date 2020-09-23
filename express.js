const { json } = require('body-parser');
const express = require('express');//express 소환
const app = express();


app.set('views',__dirname+"/client");// ejs 템플릿 소환 및 설정
app.set('view engine','ejs');


const mg = require('mongoose');//몽고DB연결->mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
let DBURL="mongodb+srv://test:test@test.3qxcs.mongodb.net/chatDB?retryWrites=true&w=majority"
mg.connect(DBURL,{useUnifiedTopology: true, useNewUrlParser: true}).then(()=>console.log('MongoDB connected...')).catch(err=>console.log(err));


app.use('/css',express.static(__dirname+'/css'));             //static(정적) 경로 등록방법
app.use('/image',express.static(__dirname+'/image'));        //use란 서버에 오는 모든 명령어는 use에 등록된 정보를 거쳐서 가야한다는 의미로 middleware라고도 한다.
app.use('/javascript',express.static(__dirname+'/javascript'));//만약 /css 라는 명령이 들어오면 다음과같이 static 경로로 변환하라 라는뜻 

app.use(express.json()) //bodyparser 소환 for parsing application/json
app.use(express.urlencoded({ extended: true }));



//스키마 모델 소환
const {LogModel}=require('./model/chatlogModel');
const {StatusModel}=require('./model/roomStatusModel');

//손님 챗팅방
app.get("/guest",function(req,res){
    // console.log(req.body.message)
    var createRoom= new LogModel(req.query)
    var room=new StatusModel({guest:1})
    //Object.assign(req.body, {}) 받아온값에 값추가
    res.render("guest");
    
});

//손님 메세지를 post방식으로 보냄
app.post("/guest/message",(req,res)=>{
    console.log(req.body.message);

    res.render("guest");
});



//의사 챗팅방 목록보기
app.get("/standBy",function(req,res){
    
    
    
    res.render("standBy");
    
});
//의사 챗팅방
app.get("/doctor",function(req,res){
    
    console.log(req.query.message);
    
    
    //res.sendFile(__dirname+"/client/doctor.html")
    
    //랜더를 통해 페이지 이동
    res.render("doctor",{title:"express",array:[{name:"1",age:"일"},{name:"2",age:"이"}]});
});
//의사 챗팅방에서 post(챗팅입력)값받기
app.post("/doctor/message",(req,res)=>{


    console.log(req.body.message);

    res.render("doctor",{title:"express",array:[{name:"1",age:"일"},{name:"2",age:"이"}]});
});




//팜플릿 경로
app.get("/d",function(req,res){
    
    
    res.sendFile(__dirname+"/referenceTemplate/template.html");
    
})



//페이지를 찾지 못했을때
app.use((req,res)=>{
    
    res.render("404");
});


//포트지정
app.listen(2000,function(err){
    if(err) return console.log(err);


    console.log("the sever is listening on 2000")
});