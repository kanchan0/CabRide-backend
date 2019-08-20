const con = require('./db.users')
const bcrypt=require("bcrypt")


const CreateAdmin=(req,res)=>{

    const AdminData={
        name:"kanchan",
        email:"kanchan080197@gmail.com",
        phone:"8603842370",
        password:"kanchan",
    }
    AdminData.password= bcrypt.hashSync(AdminData.password,10)

    const sql="select * from Admin";
    con.query(sql,(err,admins)=>{
        let count=0;
        for(let admin of admins){
            if(admin) count++
        }
        if(count>0){
           return;
        } else{
            const sql ="insert into Admin set ?"
            con.query(sql,AdminData,(err,result)=>{
                if(err){
                    throw err;
                }else{
                    res({status:true,message:"Admin successfully created"})
                }

            })
        }
    })
}


module.exports=CreateAdmin;
