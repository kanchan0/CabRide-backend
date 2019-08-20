const bcrypt=require('bcrypt');  
const con = require('../databases/db.users')
const joiSchema=require('./schema.joi');

const signUpPage=(req,res)=>{

 const {name,email,password,phone,age,address}=req.body;
 const driverData={
     name,
     email,
     password,
     phone,
     age,
     address
 }  
 const {error}=joiSchema.validateUser(driverData);
 
 if(error){  
    res.status(400).send({status:400,message:`${error.details[0].message}`}); 
    return; 
    }

 driverData.password = bcrypt.hashSync(password,10)
    
    let ctr = 0;
    let sql1 = "select * from driverdetails;"
    con.query(sql1,(err,drivers)=>{

        for(let user of drivers){
            if(user.phone==phone || user.email==email){
                ctr= ctr+1;
            }
        }

        if(ctr<1){
        let sql ="INSERT INTO driverdetails set ?;"
        con.query(sql,driverData,function(err,result){

                if(err){
                    throw err 
                    
                } else{
                    console.log("1 record entered successfully")
                    res.send({status:true,message:"data inseted into database successfully"})
                }
            })
        } else {
            res.send({status:false,message:"phone or email already in databse"})
        }
    })
}



const loginPage=(req,res)=>{
    let phone = req.body.phone;
    let password=req.body.password
    console.log(phone,password)

    let count = 0;
    let sql = "select * from driverdetails;"
    con.query(sql,(err,drivers)=>{
        if(!err){
        for(let user of drivers){
            if(user.phone===phone){
                bcrypt.compare(password,user.password,(err,resolve)=>{
                    if(!err){
                    if(resolve){
                        res.send({status:true,message:"Authenticated,logged in succesfully"})

                    }else{
                        res.send({status:false,message:"password is incorrect"})
                    }
                  }
                })
            }
        }
    }
  })
}




module.exports={
    signUpPage,
     loginPage,

}