const con = require('../databases/db.users')
 
 let getbookingById=(req,res)=>{
    let user_id = req.params.id;

    const sql=`select userrides.id,userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,
             userrides.date_time,userrides.status from userrides 
            inner join userdata 
            on userrides.foreign_user_id=userdata.id
            where userdata.id=?`; 
    
            con.query(sql,user_id,function(err,ride_details){ 
                        
                if(err) throw err;         
                res.send(ride_details)
            })
 }


 let getbooking=(req,res)=>{

    const sql=`select userrides.id,userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,userrides.date_time,userrides.status 
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

    const sql=`select userrides.id,userdata.name,userdata.email,userdata.phone ,userrides.source,userrides.destination,userrides.date_time,userrides.status 
            from userrides 
            inner join userdata 
            on userrides.foreign_user_id=userdata.id
            where userrides.date_time >= ? AND userrides.date_time<= ?`; 
    
            con.query(sql,[from_date,to_date],function(err,ride_details){ 
                        
                if(err) throw err; 
                       
                res.send(ride_details)
            })
 }

const freeDriver = (req,res)=>{
    let result = [];

    const sql = "select name,phone,email,status from driverdetails;"
    
    con.query(sql,(err,drivers)=>{
        if(err) throw err;
        for(let  driver of drivers){
        result.push(driver);
        }
    res.send(result);

    })

}

const assignBooking = (req,res)=>{

    let booking_id=req.params.id;

    const sql1 = `select * from userrides where id=${booking_id};`
    con.query(sql1,(err,result)=>{
        
        if(Object.keys(result).length===0){
            res.send({status:false,message:"incorrect booking id given,no rides booked yet"})
        
        }else if(result[0].status==="assigned"){
            res.send({status:false,message:"driver already assigned"})

        } else {

            const sql1 = `select * from userrides where id = ${booking_id} AND Contains(
                GeomFromText('POLYGON((0 0,0 100,100 100,100 0,0 0))'),
                location);`
            
            con.query(sql1,(err,ids)=>{
                
                if(err) throw err;
                if(Object.keys(ids).length===0){
                    res.send({status:false,message:"we not servicable in this location yet"})
                } else{

                    const sql = "select id from driverdetails where status = 1;"
                    con.query(sql,(err,ids)=>{
                            if(err) throw err;
                    
                            const driver_id = ids[0].id;
        
                            con.query(`update driverdetails set status = 0 where id = ${driver_id};`,(err,result)=>{
                                if(err) throw err;
                            })
                            con.query(`update userrides set status = "assigned",foreign_driver_id=${driver_id} 
                                        where id = ${booking_id} and status = "requesting";`,(err,result)=>{
                                            if(err) throw err;
                                        })
                   })
                   res.send({status:true,message:"Driver successfully alloted the specified booking"})
                 }
            })
            
        
        }

  })


   
}

module.exports={
     getbooking,
     getbookingById,
     getbookingByDate,
     assignBooking,
     freeDriver
}