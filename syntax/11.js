//배열=>데이터를 순서에 따라서 정리
var members=['1','2','3']


//객체 =>데이터를 key에따라 정리=>json으로 표현할 수있다.
var roles={
    'jmy1':'yoon',
      jmy2:'kim',
    'jmy3':'fuck'
}
//아래와같은 형식으로 객체의 변수값을 표현 할 수 있다. .을통해 []을 통해
roles.jmy1
console.log(roles['jmy1'])



//자바스크립트에서는 함수가 값이되어 변수에 담겨질수있으며
//그 변수값이 함수명이 된다.
for(var a in roles){
    console.log(roles[a]);
}
var f = function(){
    console.log(1)
}
function d (){
console.log("d")
}
f();
///파라미터를 나중에 줄수도있고 처음부터 배열에 추가할 수도있다.(파라미터를 나중에 넣는것이 좋다 변수를 언제건 바뀌어야하니까.)
var a = [f,d];
a[0]();
a[1]();

var o = {
    func:f
  }
  o.func();