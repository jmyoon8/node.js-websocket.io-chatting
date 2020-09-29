//로컬 호스트 부분
var localhost="http://localhost:2000"

//환자 부분에서 닫을 때 사용하는 로직
function closee(){
    var roomCode=document.chatting.roomCode.value
    var data ={roomCode:roomCode}
    //발표전 Ip채크
    var url=localhost+"/guestout"
    data=JSON.stringify(data)
    
    
    var ajax= new XMLHttpRequest();
    ajax.open('POST',url);
    ajax.setRequestHeader('content-type',"application/json")
    ajax.send(data);
    ajax.addEventListener('load',()=>{
        alert("의사와의 챗팅방에서 나오셨습니다.")
    })
    window.self.close();
}

// //대화할때 db에 저장해야 할 것들
function ajaxMessage() {
    //보내야할 데이터
    // <input class="input"  id="m" autocomplete="off" type="text" name="message" onKeypress="javascript:if(event.keyCode==13){ajaxMessage();}" input placeholder="메세지를입력하세요" autofocus/>
    // <input class="button" type="button" value="전송" readonly onclick="ajaxMessage();" ></input>
    var lfl=1;
    var message = document.getElementById("m").value;
    var guest=document.chatting.guest.value;
    var section=document.chatting.section.value;
    var roomCode = document.chatting.roomCode.value;
    var doctor=document.chatting.doctor.value;
    var who=document.chatting.who.value;
    if(doctor){
        lfl=0
    }

    var data={
        message:message,
        guest:guest,
        section:section,
        roomCode:roomCode,
        doctor:doctor,
        who:who,
        lfl:lfl
    }
    data=JSON.stringify(data)
    var url=localhost+"/guest/message"
    var ajax= new XMLHttpRequest();
    ajax.open('POST',url);
    ajax.setRequestHeader('content-type','application/json');
    ajax.send(data)
    ajax.addEventListener('load',()=>{
    
    var result=JSON.parse(ajax.responseText)
    if(result.roomMiss==true){
        alert("방이없습니다.!!!")
        self.close();
    }

    })
}

 //의사가 방에 들어갈떄
 function joinDoctor(){
    var socket=io();
    var number=""
    var list=document.getElementsByName("list");
    for(var i =0; i<list.length; i++){
        if(list[i].checked==true){
            number=list[i].value
        }
    }
    
    var guest   = document.getElementsByName("guest")[number].value
    var section = document.getElementsByName("section")[number].value
    var who     = document.getElementsByName('who')[number].value
    var doctor  = document.getElementsByName('doctor')[number].value
    var roomCode= document.getElementsByName('roomCode')[number].value
    //socket 방으로 이동(roomCode로 생성)
    location.href="/guest?guest="+guest+"&section="+section+"&who="+who+"&doctor="+section+"&roomCode="+roomCode;
    socket.on('join',(data)=>{
        //화면이동
       
    })
    
    
}

$(function () {
    var socket = io();

    
    
    $('form').submit(function(e){
        
        e.preventDefault(); // prevents page reloading
        var message = document.getElementById("m").value;
        var guest=document.chatting.guest.value;
        var section=document.chatting.section.value;
        var roomCode = document.chatting.roomCode.value;
        var doctor=document.chatting.doctor.value;
        var who=document.chatting.who.value;
        var guestIO=document.chatting.guestIO.value;
        
        var data={
            roomCode:roomCode,
            message:message,
            guest:guest,
            doctor:doctor,
            section:section,
            who:who,
            guestIO:guestIO
        }
        //매시지 보내는곳
        socket.emit('chat message', data);
        $('#m').val('');
        return false;
    });
    
    //매시지 받으면 출력시키는 곳
    socket.on('chat message', function(msg){
       if(msg=='docJoin'){

       }
       
       var roomCode=msg.roomCode;
       var message=msg.message;
       var guest=msg.guest;
       var doctor=msg.doctor
       var section=msg.section;
       var msgwho=msg.who;
       var who=document.chatting.who.value;
       var guestIO=msg.guestIO
       var log=""
       
       //의사가 들어왔는지 손님이 들어왔는지 확인
       if(msg=='doctor'){
           $('#messages').append($('<li class="start"><p >의사가 연결되었습니다 챗팅을 시작하세요!</p></li>'));
       }else if(msg=='guest'){
            $('#messages').append($('<li class="start"><p >손님이 연결되었습니다 챗팅을 시작하세요!</p></li>'));
       }
       
       if(who=='guest'){
            
           if(msgwho=='guest'){
                var doctor=document.getElementById("doc").value
                
                var lfl="<p class='message'>"+message+"<p class='lfl'>1</p></li>"
                $('#messages').append($(" <li class='replies'>\
                <img src='../image/patient.png' />" +lfl));
                            
              
            }else if(msgwho=='doctor'){
                $('#messages').append($(" <li class='sent'>\
                <img src='../image/doctor.png'/>\
                <span>"+doctor+"</span><br><p>"+message+"</p></li>"));
                
            }
        }else if(who!=guest){
            
            if(msgwho=='doctor'){
                $('#messages').append($("<li class='replies'>\
                    <img src='../image/doctor.png' />\
                    <p class='message'>"+message+"\</p></li>"));

            }else if(msgwho=='guest'){
                $('#messages').append($(" <li class='sent'>\
                <img src='../image/patient.png' />\
                <span>"+guest+"</span><br><p>"+message+"</p></li>"));
            }
        }
    });
});


    
    
    
