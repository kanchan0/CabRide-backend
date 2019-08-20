const timeValidator=(date_time)=>{


    let userDate = new Date(date_time)
    let today = new Date()
    let today1 = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+" "+
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

    if(userDate>=today1){
        return true;
    }  else{
        return false
    }     

}

module.exports = timeValidator;