const bcrypt=require('bcrypt');  
const con = require('../databases/db.users')
const joiSchema=require('./schema.joi');
const timeValidator = require("./dateValidation")
const db = require("../databases/db.log")
const Log=require('../databases/schema.log');

const signUpPage=(req,res)=>{

 const {name,email,password,phone}=req.body;
 const userData={
     name,
     email,
     password,
     phone
 }  
 const {error}=joiSchema.validateUser(userData);
 
 if(error){  
    res.status(400).send({status:400,message:`${error.details[0].message}`}); 
    return; 
    }

 userData.password = bcrypt.hashSync(password,10)
    
    let ctr = 0;
    let sql1 = "select * from userdata;"
    con.query(sql1,(err,users)=>{

        for(let user of users){
            if(user.phone==phone || user.email==email){
                ctr= ctr+1;
            }
        }

        if(ctr<1){
        let sql ="INSERT INTO userdata set ?;"
        con.query(sql,userData,function(err,result){

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
    let sql = "select * from userdata;"
    con.query(sql,(err,users)=>{
        for(let user of users){
            if(user.phone===phone){
                bcrypt.compare(password,user.password,(err,resolve)=>{
                    if(resolve){
                        res.send({status:true,message:"Authenticated,logged in succesfully"})

                    }else{
                        res.send({status:false,message:"password is incorrect"})
                    }
                })
            }
        }
    })
}


const createbooking = (req,res)=>{

    let log=new Log({
            date:new Date()+"",
            startTime:req._startTime+"",
            startAt:req._startAt+"",
            Host:req.headers.host+"",
            Path:req.route.path+"",
            Method:req.route.stack[0].method+"",
            headers:JSON.stringify(req.headers),
            body:JSON.stringify(req.body),                
            route:JSON.stringify(req.route)
    })

    log.save((err,log)=>{
        if(err) throw err;
        console.log("log send successfully")
    })

    const {date_time,source,destination,location,phone}=req.body;
    let RideData={
        
        date_time,
        source,
        destination,
        foreign_user_id:null
    
    }  
    let location1 = location.split(" ")
    let latitude = location1[0];
    let longitude=location1[1];


    const {error}=joiSchema.validateUser({phone});
 
      if(error){  
            res.status(400).send({status:400,message:`${error.details[0].message}`}); 
            return; 
    }
    
    let sql2 = "select * from userdata;"
    con.query(sql2,(err,users)=>{

        for(let user of users){
            
            if(user.phone===phone){
                
                RideData['foreign_user_id']=user.id;
                //return;
            }
        }
        
        if(RideData['foreign_user_id']!==null){
            let result = timeValidator(date_time);
            if(result){


                con.query("select * from Admin",(err,admins)=>{
                    let admin_id;
                    for(let admin of admins){
                        if(err) return err
                     admin_id=admin.id;
                    }

        let sql=`INSERT INTO userrides (location,source,destination,date_time,foreign_user_id,foreign_admin_id) 
        VALUES (ST_GeomFromText('POINT(${latitude} ${longitude})'),
        '${RideData.source}','${RideData.destination}',
        '${RideData.date_time}',${RideData.foreign_user_id},${admin_id});`;
        //const query = con.query(sql,(err,result)=>{
            //console.log("query >>>>>>>>>>>>>>> ",query.sql);
            con.query(sql,(err,result)=>{
              if(err){
                throw err 
                
               } else{
                 console.log("1 record entered successfully")
                 res.send({status:true,message:"data inserted for ride details successfully"})
               }
           })
        })
          }else{  

                res.send({status :false,message:"date or time is invalid"})
            }
        } else{
            res.send({status:false,message:"user not registered"})
        }
  
      })

}
 
 
 
 
 let getbookingById=(req,res)=>{
    let user_id = req.params.id;

    const sql=`select userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,userrides.date_time 
            from userrides 
            inner join userdata 
            on userrides.foreign_user_id=userdata.id
            where userdata.id=?`; 
    
            con.query(sql,user_id,function(err,ride_details){ 
                        
                if(err) throw err;         
                res.send(ride_details)
            })
 }


 let getbooking=(req,res)=>{

    const sql=`select userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,userrides.date_time 
            from userrides 
            inner join userdata 
            on userrides.foreign_user_id=userdata.id`; 
    
            con.query(sql,function(err,ride_details){ 
                        
                if(err) throw err; 
                       
                res.send(ride_details)
            })
 }


 let getbookingByDate=(req,res)=>{

    let from_date=new Date(req.params.from_date);
    let to_date=new Date(req.params.to_date)

    const sql=`select userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,userrides.date_time 
            from userrides 
            inner join userdata 
            on userrides.foreign_user_id=userdata.id
            where userrides.date_time >= ? AND userrides.date_time<= ?`; 
    
            con.query(sql,[from_date,to_date],function(err,ride_details){ 
                        
                if(err) throw err; 
                       
                res.send(ride_details)
            })
 }

module.exports={
    signUpPage,
     loginPage,
     createbooking,
     getbooking,
     getbookingById,
     getbookingByDate
}