const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/uberLogDb');
let db = mongoose.connection;

db.once('open',()=>{
    console.log('Connected to MongoDB');
});

// check for the error
db.on('error',(err)=>{
    console.log(err);
});
module.exports=db;