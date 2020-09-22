const express = require('express')
const app = express();

//static(정적) 경로 등록방법
//use란 서버에 오는 모든 명령어는 use에 등록된 정보를 거쳐서 가야한다는 의미로 middleware라고도 한다.
//만약 /css 라는 명령이 들어오면 다음과같이 static 경로로 변환하라 라는뜻 
app.use('/css',express.static(__dirname+'/css'))
app.use('/image',express.static(__dirname+'/image'))
app.use('/javascript',express.static(__dirname+'/javascript'))

//function(req,res,next){}를 통해 req, res를 컨트롤 할 수도 있다.
app.use(function(req,res,next){
    req.user={
        id:"1234"
    }
    //이후 모든 라우터에서 console.log(res.user)  을 찍어보면 값을 반환한다.
    //미들 웨어가 실행되고 next를 통해 다음 을 실행하라고 명령한다.
    next();
})

//서버로의 요청이 get방식일때

app.get("/doctor",function(req,res){
    
    console.log(req.user['id'])
    
    res.sendFile(__dirname+"/client/doctor.html")
    
})

app.get("/guest",function(req,res){
    
    
    res.sendFile(__dirname+"/client/guest.html")
    
})


app.get("/d",function(req,res){
    
    
    res.sendFile(__dirname+"/referenceTemplate/template.html")
    
})

//서버로의 요청이 post방식일때
app.post("",function(req,res){

})

//어떤 값이 delete될떄
app.delete("")

//어떤 값이 put될때
app.put("")

//페이지를 찾지 못했을때
app.use((req,res)=>{
    res.sendFile(__dirname+"/client/404.html")
})

app.listen(2000,function(err){
    if(err) return console.log(err)

    console.log("the sever is listening on 3000")
})