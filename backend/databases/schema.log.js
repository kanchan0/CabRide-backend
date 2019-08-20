let mongoose=require('mongoose');

let LogSchema=mongoose.Schema({
    date:{
        type:Date
    },

   startTime:{
       type:String
   },
    startAt:{
        type:String,
        required:true
    },  
    Host:{
        type:String,
        required:true
    },
    Path:{
        type:String,
        required:true
    },
    Method:{
        type:String,
        required:true
    },
    headers:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    route:{
     type:String,
     required:true
    },

});

let Logs=module.exports=mongoose.model('Log',LogSchema);