const mg = require('mongoose')

var statusSchema=mg.Schema({

    roomCode:{
        //닥터가 어떤 방에 들어가면 그 방의 코드를 DB에 올림
        type:String
    },
    doctor:{
        //닥터가 해당방에 들어와있으면 1 없으면 0
        type:Number
    },
    guest:{
        //손님이 
        type:Number
    }
})


const statusModel=mg.model("statusModel",statusSchema);

module.exports={statusModel}