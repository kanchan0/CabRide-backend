const Joi = require('@hapi/joi');
//const myCustomJoi = Joi.extend(require('joi-phone-number'));
let validateUser=(data)=>{

    const schema=Joi.object().keys({
        name:Joi.string().min(3).max(30),
        email:Joi.string().email({minDomainSegments:2}),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        phone:Joi.string().regex(/^[0-9]{10}$/).required(),
        age:Joi.number().min(18).max(65),
        address:Joi.string()
    })
   return Joi.validate(data,schema);
}

module.exports={
    validateUser
}
