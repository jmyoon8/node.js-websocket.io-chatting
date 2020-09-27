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
// //대화할때 사용할 AJAX
function ajaxMessage() {
    //보내야할 데이터
    var message = document.chatting.message.value;
    var guest=document.chatting.guest.value;
    var section=document.chatting.section.value;
    var roomCode = document.chatting.roomCode.value;

    var doctor=document.chatting.doctor.value;
    
   if(doctor==""){
       doctor==null
   }
  
    var who=document.chatting.who.value;
    var guestIO=document.chatting.guestIO.value;
    
    var data={
        message:message,
        guest:guest,
        section:section,
        roomCode:roomCode,
        doctor:doctor,
        who:who
    }
    data=JSON.stringify(data)
    var url=localhost+"/guest/message"
    var ajax= new XMLHttpRequest();
    
    ajax.open('POST',url);
    ajax.setRequestHeader('content-type','application/json');
    
    ajax.send(data)
    ajax.addEventListener('load',()=>{
        
    
    var result=JSON.parse(ajax.responseText)
    alert(result)
    if(result.roomMiss==true){
        alert("방이없습니다.!!!")
        self.close();
    }
    
  
    var test=document.querySelector(".test");
    var list="";
    for(var a =0; a<result.conversation.length; a++){
        list=list+result.conversation[a].message+" ";
        
    }
    alert(list)
    test.innerHTML=list


// 인풋쪽 
// 버튼쪽 



    })

    


}