const {Users}=require('../models/users');
const express=require('express');
const Joi=require('@hapi/joi');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const config=require('config');
const router=express.Router();

router.post('/',async(req,res)=>{
    const {error}=validateUser(req.body);
    if(error) return res.status(400).send('Inavlid username or password');
    console.log(req.body.email);
    const user=await Users.findOne({email:req.body.email});
    console.log(user.password,req.body.password);
    //const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid username or password');

    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send('Invalid Username or password');

    const token=user.generateAuthToken();
    res.send(token);
})

function validateUser(user){
    const schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required()
    })
    return schema.validate(user);
}

module.exports=router;