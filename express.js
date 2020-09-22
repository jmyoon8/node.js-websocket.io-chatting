const express =require('express');
const server=express();


//서버로의 요청이 get방식일때
server.get("/",function(req,res){
    
    
    res.send("<h1>hello express</h1>")
})


//서버로의 요청이 post방식일때
server.post("",function(req,res){

})

//어떤 값이 delete될떄
server.delete("")

//어떤 값이 put될때
server.put("")



server.listen(3000,function(err){
    if(err) return console.log(err)

    console.log("the sever is listening on 3000")
})