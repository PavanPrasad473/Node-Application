const mongoose=require('mongoose');
const Joi=require('@hapi/joi');
const jwt=require('jsonwebtoken');
const config=require('config');

const schema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isAdmin:Boolean
});
schema.methods.generateAuthToken=function(){
   return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
}
const Users=mongoose.model('Users',schema);

function validateUser(user){
    const schema=Joi.object({
        name:Joi.string().required().max(128),
        email:Joi.string().required().email(),
        password:Joi.string().required(),
        isAdmin:Joi.boolean()
    });
    return schema.validate(user);
}

exports.Users=Users;
exports.userSchema=schema;
exports.validate=validateUser;

