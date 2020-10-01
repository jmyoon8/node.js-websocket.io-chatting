//status ajax
var guest=1;
var doctor=1;

setInterval(() => {
    var roomCode=document.getElementsByName('roomCode')[0].value;
    var data={roomCode:roomCode}
    //데이타 준비

    var localhost="http://localhost:2000"
    var ajax=new XMLHttpRequest();
    var url='/status'
    ajax.open('POST',localhost+url)
    ajax.setRequestHeader('Content-Type',"application/json")
    ajax.send(JSON.stringify(data))
    ajax.addEventListener('load',()=>{
        
        var status=JSON.parse(ajax.responseText)
        
        
         //의사가 들어왔는지 손님이 들어왔는지 확인
        if(status.guestIO==1){
            
            document.getElementById("guest").className="online"
            document.getElementById('GN').innerHTML=status.guest
            
            if(guest==1){

               $('#messages').append($(" <li ><p style='text-align: center;'>손님이 입장하셨습니다.</p></li> "));
               
               guest=2;

            }

        }else if(status.guestIO==0){
            
            document.getElementById("guest").className='offline'
            document.getElementById('GN').innerHTML="미접속"
            

            if(guest==2){

                $('#messages').append($(" <li style='text-align:center;'><p style='text-align: center;'>손님이 퇴장하셨습니다.</p></li> "));
              
                guest=1;
 
             }
        }
            
        if(status.doctor||status.doctor!=null){
            
            document.getElementById("doctor").className="online";
            document.getElementById('DN').innerHTML=status.doctor
           

            if(doctor==1){

                $('#messages').append($(" <li style='text-align:center;'><p style='text-align: center;'>의사가 입장하셨습니다.</p> </li> "));
                
                doctor=2;
 
             }
            
        }else if (!status.doctor||status.doctor==null){
            
            document.getElementById("doctor").className='offline'
            document.getElementById('DN').innerHTML="미접속"
        

            if(doctor==2){

                $('#messages').append($(" <li style='text-align:center;'><p style='text-align: center;'>의사가 퇴장하셨습니다.</p> </li> "));
                doctor=1;
 
             }
        }

    })
 },500);