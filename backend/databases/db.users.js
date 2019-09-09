const mySQL = require("mysql");

const connection = mySQL.createConnection({
    host:"localhost",
    user:"root",
    password:"Password_Of_My_Sql",
    database:"Database_Name",
    });
    
 connection.connect(function(err){
     if(err) throw err
     console.log("mysql connected to user")

 })
 module.exports = connection
