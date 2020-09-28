const express = require('express');//express 소환
const app = express();

//웹소캣 준비(http로 리슨해야한다.)
const http = require('http').createServer(app);
const io = require('socket.io')(http)
//포트지정




app.get('/e', (req, res) => {

    res.render('socket')
});


app.set('views',__dirname+"/client");// ejs 템플릿 소환 및 설정
app.set('view engine','ejs');


const mongoose = require('mongoose');//몽고DB연결->mongoose 소환 스키마와 모델을 이용해서 데이터를 다룸
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

//손님 챗팅방 만들거나 기존에 있던방 들어가기
app.get("/CROIR", (req,res)=>{

    // http://localhost:2000/CROIR?guest=jmyy&section=IM&who=guest     손님이 들어올 URL
    //손님이 챗팅방에 들어오면 자동으로 roomcode를 시퀀스하여 방번호 생성(=방 생성) req에 손님이름 진료과 선정
    StatusModel.findOne({guest:req.query.guest,section:req.query.section},  function(err,status){
        console.log("방들어가기전 있는지없는지 체크",status)
        if(status==null){
            var status= Object.assign(req.query,{guestIO:1})
            StatusModel(status).save((err,statusInfo)=>{
                if(!status)console.log("방생성성공!")
            })
        }else{
            StatusModel.findOneAndUpdate({guest:req.query.guest,section:req.query.section},{guestIO:1},(err,status)=>{
                if(!err)console.log("방에 들어오셨습니다.!")
            })
        }
    })
    res.redirect("/guest?guest="+req.query.guest+"&section="+req.query.section+"&who="+req.query.who)       
  
     
});

var whojoin=""
var whoOut=""
io.on('connection', function(Socket){
    
    //의사/손님이 서버에 들어왔을때 가 들어올때
    console.log("다시들어왔습니다.")
    if(whojoin!='doctor'){
        io.emit ( 'chat message' ,'doctor'); 
    }else {
        io.emit ( 'chat message' ,'guest'); 
    }

    
    //매세지를 보낼때 실행되는곳
    Socket.on ( 'chat message' , (msg) => { 
        console.log(msg.message)
        
        io.emit ( 'chat message' , msg); 
    }); 
    //나갈 때 실행되는곳
    Socket.on('disconnect',()=>{
        console.log("끈겼습니다.")
        
        io.emit('chat message',"off")
    });
})

//방만든 손님이 들어갈 방으로 보냄
app.get("/guest", async function(req,res){
    whojoin=req.query.who
    
    
    var roomCodee=0;
    
    //회원아이디로 방코드 알려주기
    if(req.query.doctor!=undefined){
        //http://localhost:2000/guest?guest=jmy&section=IM&who=doctor&doctor=IM 접속방법
        //닥터가 방에 들어갈경우 roomstatus를 찾아 doctor 부분에 닥터 섹션 update(방에접속했는지 안했는지 확인)
        StatusModel.findOneAndUpdate({guest:req.query.guest,section:req.query.section},{doctor:req.query.doctor},(err,status)=>{
           if(!status){console.log("방을 못찾았습니다.")}
        })
         //닥터가 방에들어가는순간 lfl 값 0이됨(읽음표시)
        await LogModel.updateMany({guest:req.query.guest,section:req.query.section},{lfl:0},(err,status)=>{
        })
    }
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



// 여길타면 매새지를 보내보자
app.post('/guest/message',(req,res)=>{
    
    console.log(req.body)
   
})

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
//환자 채팅방 out
app.post("/guestout",function(req,res){
    console.log(req.body)    
    StatusModel.findOneAndUpdate({roomCode:req.body.roomCode},{guestIO:0},(err,status)=>{
        if(err)console.log(err)

    })
    
    
});

//의사 챗팅방에서 post(챗팅입력)값받기
app.get("/test",(req,res)=>{


    console.log(req.body.message);

    res.render("doctor");
});




//팜플릿 경로
app.get("/d",function(req,res){
    
    
    res.sendFile(__dirname+"/referenceTemplate/template.html");
    
})



//페이지를 찾지 못했을때
app.use((req,res)=>{
    
    res.render("404");
});


//소캣포트
http.listen(2000,function(err){
    if(err) return console.log(err);
    console.log("the sever is listening on 2000")
});