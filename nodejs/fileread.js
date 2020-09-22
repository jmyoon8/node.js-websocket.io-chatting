var fs =require('fs')
//가져올 파일의 주소, 엔코더명, 가져왔을때(실패,성공)실행할 함수
fs.readFile('sample.html','UTF-8',function(err,data){
    console.log(data)
})