const {Users,validate}=require('../models/users');
const bcrypt=require('bcrypt');
const _=require('lodash');
const express=require('express');
const jwt=require('jsonwebtoken');
const config=require('config');
const router=express.Router();

router.post('/',async (req,res)=>{
    try {
        const {error}=validate(req.body);
        if(error)return res.status(400).send('Invalid user details');
        
        let user=await Users.findOne({'email':req.body.email});
        if(user) return res.status(400).send('Email ALready Exists');
        user=new Users(_.pick(req.body,['name','email','password','isAdmin']));
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
        await user.save();
        const token=user.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));    
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports=router;