const { json } = require('body-parser');
const { compile } = require('ejs');
const express = require('express');//express 소환
const app = express();


app.set('views',__dirname+"/client");// ejs 템플릿 소환 및 설정
app.set('view engine','ejs');


const mongoose = require('mongoose');//몽고DB연결->mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
const chatlogModel = require('./model/chatlogModel');
let DBURL="mongodb+srv://test:test@test.3qxcs.mongodb.net/chatDB?retryWrites=true&w=majority"
mongoose.connect(DBURL,{useUnifiedTopology: true, useNewUrlParser: true}).then(()=>console.log('MongoDB connected...')).catch(err=>console.log(err));

//몽구스 지원중단 경고 띄우지 않기
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


app.use('/css',express.static(__dirname+'/css'));             //static(정적) 경로 등록방법
app.use('/image',express.static(__dirname+'/image'));        //use란 서버에 오는 모든 명령어는 use에 등록된 정보를 거쳐서 가야한다는 의미로 middleware라고도 한다.
app.use('/javascript',express.static(__dirname+'/javascript'));//만약 /css 라는 명령이 들어오면 다음과같이 static 경로로 변환하라 라는뜻 

app.use(express.json()) //bodyparser 소환 for parsing application/json
app.use(express.urlencoded({ extended: true }));



//스키마 모델 소환
const {LogModel}=require('./model/chatlogModel');
const {StatusModel}=require('./model/roomStatusModel');

//손님 챗팅방 만들기
app.get("/createRoom",function(req,res){
    
    // http://localhost:2000/createRoom?guest=jmy&section=IM&who=guest
    //손님이 챗팅방에 들어오면 자동으로 roomcode를 시퀀스하여 방번호 생성(=방 생성) req에 손님이름 진료과 선정
    StatusModel.findOne({guest:req.query.guest,section:req.query.section},(err,status)=>{
        if(status==null){
            StatusModel(req.query).save((err,statusInfo)=>{
                
                if(!err){
                    console.log("방생성성공!")
                }else{
                    console.log("이미 방이있습니다.")
                }
            })
        }
    })
    setTimeout(() => {
        res.redirect("/guest?guest="+req.query.guest+"&section="+req.query.section+"&who="+req.query.who)        
    }, 500);
    
});

//방만든 손님이 들어갈 방으로 보냄

app.get("/guest",function(req,res){
    var roomCodee=0;
    //회원아이디로 방코드 알려주기
    
    if(req.query.doctor!=undefined){
        
        //http://localhost:2000/guest?guest=jmy&section=IM&who=doctor&doctor=IM 접속방법
        //닥터가 방에 들어갈경우 roomstatus를 찾아 doctor 부분에 닥터 섹션 update(방에접속했는지 안했는지 확인)
        StatusModel.findOneAndUpdate({guest:req.query.guest,section:req.query.section},{doctor:req.query.doctor},(err,status)=>{
           if(!status){console.log("방을 못찾았습니다.")}
       
        })
         //닥터가 방에들어가는순간 lfl 값 0이됨(읽음표시)
         
         LogModel.updateMany({guest:req.query.guest,section:req.query.section},{lfl:0},(err,status)=>{
            
            
            
        })
    }
        //
        StatusModel.findOne({guest:req.query.guest,section:req.query.section},(err,status)=>{
            if(err) return console.log("룸 스테이터스조회 실패")
            if(!status) return console.log("방이없습니다.")
            
            roomCodee=status.roomCode
    
            Object.assign(req.query,{roomCode:roomCodee})
            //의사가 없을경우
            if(!status.doctor){
                Object.assign(status,{doctor:null,who:req.query.who})
                
            }
            if(!status.conversation){
                status.conversation="emptyLog"
                
            }
            LogModel.find({roomCode:status.roomCode},(err,logs)=>{
          
                if(logs.length==0){
                    
                    return res.render("guest",Object.assign(status,{who:req.query.who,conversation:"emptyLog"}));
                }
                
                
                res.render("guest",Object.assign(status,{who:req.query.who,conversation:logs}));
            })
            
            

        })
});

//손님 메세지를 post방식으로 보냄
app.post("/guest/message", (req,res)=>{

    var st =req.body
    StatusModel.findOne({roomCode:req.body.roomCode},(err,status)=>{
        
        
        Object.assign(st,{doctor:status.doctor})      
        if(st.doctor!=null){
        
            //http://localhost:2000/guest?guest=jmy&section=IM&who=doctor&doctor=IM 접속방법
            //닥터가 방에 들어갈경우 roomstatus를 찾아 doctor 부분에 닥터 섹션 update(방에접속했는지 안했는지 확인)
            StatusModel.findOneAndUpdate({guest:req.body.guest,section:req.body.section},{doctor:req.body.doctor},(err,status)=>{
               if(!status){console.log("방을 못찾았습니다.")}
           
            })
             //닥터가 방에들어가는순간 lfl 값 0이됨(읽음표시)
    
            LogModel.updateMany({guest:req.body.guest,section:req.body.section},{lfl:0},(err,status)=>{
                
                
            })
        }
        
        let nowDate=new Date()
        
        st=Object.assign(st,{date:nowDate})
        
        //로그저장하기
        LogModel(st).save((err,logModel)=>{
            if(err)return console.log("message저장실패")
        })
        setTimeout(() => {
             //로그 불러와서 뿌려주기
             
            LogModel.find({guest:req.body.guest,roomCode:req.body.roomCode},(err,logs)=>{
            if(err)return console.log(err)
            if(logs){
                Object.assign(req.body,{conversation:logs})
            }else{
                Object.assign(req.body,{conversation:"대화없음"})
                console.log("대화없을때 : ",Object.assign(req.body,{conversation:"대화없음"}))
            }
            
            StatusModel.findOne({roomCode:req.body.roomCode},(err,status)=>{
                req.body=Object.assign(req.body,{doctor:status.doctor})
                
                
                res.render("guest",req.body);
            })
            
        })
        }, 50);
           
        
    })   

    
});



//의사 챗팅방 목록보기
// http://localhost:2000/standBy?section=IM
app.get("/standBy",function(req,res){
    
    StatusModel.find({section:req.query.section},(err,List)=>{
        if(err) return console.log("dddd",err)
        var roomList={rooms:List}
        //글의 갯수 구하기 (populate를통해)
        res.render("standBy",{rooms:List,section:req.query.section,roomCount:roomList.rooms.length});
    })
    
    if(req.query.roomCode){
            
        StatusModel.updateMany({roomCode:req.query.roomCode},{doctor:null},(err,status)=>{
            
        })

    }
});
//의사 챗팅방
app.get("/doctor",function(req,res){
    
    
    
    
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