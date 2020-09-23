const fs= require('fs')

//JSON 데이터 불러오기 어레이값을 불러온다
var data=fs.readFileSync("./json/vocab.json","utf8")
//그값을 JSON.parse를 통해 OBJECT화 한다.
let a=JSON.parse(data)
//인덱스 값으로 값을 불러온다.
console.log(a[0])
//JSON.parse를 하지않으면 String 그대로 가저온다.(문자그대로 인식한다.)


//JSON 데이터 저장하기(file로) 데이터를 저장 할때는 String 화 시켜야한다.
const test ={
    name:"jmy",
    age:20,
    description:"i am i'm"
}
fs.writeFileSync("test.json",JSON.stringify(test, null , 2));
                                                        //,null ,2를하면 이쁘게 저장한다.
                                                        
//json 파일을 불러올땐 parse로 object화
//json 파일을 저잘할땐 Stringify로 String화하여 저장해야한다.


