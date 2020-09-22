const express =require('express');
const server=express();


server.use('/static',express.static(__dirname+'/static'))//css파일의 경로를 지정해두어 html에 css가 적용되도록한다.
server.use('/image',express.static(__dirname+'/image'))
server.use('/javascript',express.static(__dirname+'/javascript'))

//서버로의 요청이 get방식일때
server.get("/",function(req,res){
    
    
    res.sendFile(__dirname+"/index.html")
    
})


//서버로의 요청이 post방식일때
server.post("",function(req,res){

})

//어떤 값이 delete될떄
server.delete("")

//어떤 값이 put될때
server.put("")



server.listen(2000,function(err){
    if(err) return console.log(err)

    console.log("the sever is listening on 3000")
})