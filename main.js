// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const qs = require('querystring');//post를 분석하는 모듈
// const path=require('path')//들어오는데이터 보안(상위 디렉토리로 접근 방어)
// const sanitizeHTML=require('sanitize-html')//나가는 데이터 보안(xss방어)

// //템플릿을 가져옴
// const template=require("./lib/template.js")


 



//  //서버 가 도는 로직
// var app = http.createServer(function(request,response){
//     var _url = request.url;//url가져오는 모듈
//     var queryData = url.parse(_url, true).query;//가져온 url을 parse하여 스트링 쿼리를 가져온다.
//     var pathname = url.parse(_url, true).pathname;//가저온 url을 parse하여 pathname을 가져온다.

//     if(pathname === '/'){//패스가 /일 경우
//       if(queryData.id === undefined){
        
//         fs.readdir('./data', function(error, filelist){//파일리스트를 만들어서 보내줌 ./data 폴더안에 있는 리스트를 가져옴=>배열로 반환(filelist변수에)
//           var title = 'Welcome';
//           var description = 'Hello, Node.js';
//           var list = template.list(filelist);//파일리스트를 함수안에 넣어서 반복문이 실행되고 그결과를 return함
//           var html = template.html(title, list, `<h2>${title}</h2>${description}`,
//           `<a href="/create">create</a><br>`);//
//           response.writeHead(200);
//           response.end(html);
//         })

//       } else {

//         fs.readdir('./data', function(error, filelist){
//           var filterId=path.parse(queryData.id).base;//다른경로로 접근하는것을 막는 방법 path.pasrse(경로).base
//           fs.readFile(`data/${filterId}`, 'utf8', function(err, description){
            
//             var title = queryData.id;
//             var list = template.list(filelist);
//             var sanitizedTitle=sanitizeHTML(title);
//             var sanitizedDescription=sanitizeHTML(description);
//             var html = template.html(title, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//             ` 
//               <a href="/create">create</a><br>
//               <a href="/update?id=${sanitizedTitle}">update</a><br>
//               <form action="/process_delete" method="post">
//                 <input type="hidden" name="id" value="${sanitizedTitle}">
//                 <input type="submit" value="delete">
//               </form>
//             `);
//             //delete는 form에서 post형식으로 보내야한다.(아무나 지울수없도록)
//             response.writeHead(200);
//             response.end(html);
//           });
//         });
//       }
//     } else if( pathname=='/create'){

//         fs.readdir('./data', function(error, filelist){//파일리스트를 만들어서 보내줌 ./data 폴더안에 있는 리스트를 가져옴=>배열로 반환
            
//             var title = "WEB-CREATE";
//             var list = template.list(filelist);//파일리스트를 함수안에 넣어서 반복문이 실행되고 그결과를 return함
            
//             fs.readFile('./forms/createform.html','utf8',function(err,data){
//                 var html = template.html(title, list,data,'')
//                 response.writeHead(200);
//                 response.end(html);
//             })
//         })
        
//     }else if(pathname=="/process_create"){
//         var body='';
//         //post데이터를 받는법(get방식이아닌 post방식)
//         request.on('data',function(data){//포스트방식의 데이터를 받는법 데이터를 계쏙 받아 body 변수에 쌓는다.
//             body=+body+data;
//         });

//         request.on('end',function(){//그렇게 데이터를 쌓다가 더이상 데이터가 없으면 end 콜백함수를 '자동'으로 실행한다.
//             var post =qs.parse(body)//post정보를 객체화(json) 할 수 있다.
//             var title=post.title
//             var description=post.description
//             fs.writeFile(`data/${title}.html`,description,'utf8',function(err){
//                 //err가 있을경우엔 err을 처리해주주자
//               console.log(post)
//               response.writeHead(302,{location:`/?id=${title}`})
//               //302는 패이지를 다른곳으로 이동시키라는 뜻
//               response.end()
              
//             })
//         });
        
//     }else if(pathname==='/update'){
//       fs.readdir('./data', function(error, filelist){
//         var filterId=path.parse(queryData.id).base;//다른경로로 접근하는것을 막는 방법 path.pasrse(경로).base
//         console.log(filterId)
//         fs.readFile(`data/${filterId}`, 'utf8', function(err, description){
//           var title = queryData.id;
//           var list = template.list(filelist);
//           var html = template.html(title, list, `<h2>${title}</h2>${description}`,`
//             <form  action="/process_update" method="POST">   
//               <input type="hidden" name="ddd">
//               <p><input type="hidden" value="${title}" name="id"></p>
//               <p><input type="text" name="title" value="${title}" placeholder="title"></p>
//               <p><textarea name="description"  placeholder="description">${description}</textarea></p>
//               <p><input type="submit" value="전송"></p>
//             </form>`);
          
//           response.writeHead(200);
//           response.end(html);
//         });
//       });
//     }else if (pathname==='/process_update'){
      
      
//         var body="";
//         request.on('data',function(data){
          
//           body=body+data
//         })

//         request.on('end',function(){
//           var post=qs.parse(body)
//           var id = post.id
//           var title= post.title
//           var description=post.description
//           var filterId=path.parse(id).base;//다른경로로 접근하는것을 막는 방법 ..../이런식으로 상위디렉토리로 이동시키는 코드를 제외한 값을 반환(base)
//           fs.rename(`data/${filterId}`,`data/${title}`,function(error){//일단 파일명을 바꾸고 그파일명의 내용을 변환
//             fs.writeFile(`data/${title}`,description,'utf8',function(){
//               response.writeHead(302,{Location:`/?id=${title}`});
//               response.end()
//             })
//           })
//           console.log(post)
//         })


//     }else if (pathname==='/process_delete'){
      
      
//       var body="";
//       request.on('data',function(data){
        
//         body=body+data
//       });

//       request.on('end',function(){
//         var post=qs.parse(body)
//         var id = post.id
//         fs.unlink(`./data/${id}`,function(error){//삭제를 실행하는 매소드(unlink)
//           response.writeHead(302,{Location:`/`})
//           response.end();
//         })
        
        
//       })


//   } else  {
     
//       response.writeHead(404);
//       response.end('Not found');
//     }
 
 
 
// });
// app.listen(3000);

// //크로스사이드 스크립트(xss)는 홈페이지에 어떠한 부분에 <script></script>를 이용해 해당 홈페이지를 공격하는 방식이다. 이것을방어하기 위한 기법
// //때문에<>를 다른 식으로 표현해주어야한다. 기본적으로 <는 &lt; >는 &gt;으롤 <>을 다른 방법으로표현해줄 수 있다.
// //npm 을 사용하려면 npm init을 통해 자신의 app을 npm으로 관리하도록 해준다.
// //sanitize-html을 사용하여 xss을 방어해보자.
// //입력된 스크립트가 사용자에게 보여질만한 패이지에 뿌려질 값에 sanitizeHTML()하여 살균한다(민감한 스크립트가있을경우 자동으로 걸러준다. This is dirty End)
// //허용하고 싶은 태그가 있으면 살균할때 다음처럼한다. sanitizeHTML(살균할값,{
//                                       //          allowedTags : ['b','i','em'],
//                                       //          allowedAttributes : {
//                                       //                'a':['href']    
//                                       //            },
//                                       //          allowedIframHostNames : ['url']
//                                       //          })
// //처럼 한다.