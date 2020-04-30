const express=require('express');
const router=express.Router();
const {Products,validate}=require('../models/products');
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');
const _=require('lodash');

router.get('/',async (req,res)=>{
        if(req.query!=''){
                const product=await Products.find({'name':req.query.name});
                if(!product) return res.status(404).send('Product not found ');
                res.send(product);
        }else{
                res.send(await Products.find());
        }
    
})

router.get('/:id',async(req,res)=>{
    const product=await Products.findById(req.params.id);
        if(!product) return res.status(404).send('Product not found ');
        res.send(product);
})

router.post('/',auth,async (req,res)=>{
        const {error}=validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        const product=new Products(_.pick(req.body,['name','price','Availablequantity']))
        await product.save();
        res.send(product);
});

router.put('/:id',auth,async(req,res)=>{
        // const {error}=validate(req.body);
        // if(error) return res.status(400).send(error.details[0].message);
        console.log(req.body.user[0].PurchasedQuantity);
        let product=await Products.findByIdAndUpdate(req.params.id,{
            $inc:{
                    Availablequantity: -parseInt(req.body.user[0].PurchasedQuantity),
                    PurchasedQuantity: +parseInt(req.body.user[0].PurchasedQuantity)
                }
        },{new:true});
         product.users.push({PurchasedBy:req.body.user[0].PurchasedBy,PurchasedQuantity:parseInt(req.body.user[0].PurchasedQuantity)});
         await product.save();
        if(!product) return res.status(404).send('Product with given data not found....');
        res.send(product);
});
router.put('/:name',auth,async(req,res)=>{
        if(Object.keys(req.query).length != 0){
                const {error}=validate(req.body);
                if(error) return res.status(400).send(error.details[0].message);
                let product=await Products.updateOne({"name":req.query.name},{
                        $set:{
                                price:req.body.price,
                                Availablequantity:req.body.Availablequantity
                        }
                },{new:true});
                if(!product) return res.status(404).send('Product with given data not found....');
                res.send(await Products.find());
        }else{
                const {error}=validate(req.body);
                if(error) return res.status(400).send(error.details[0].message);
                let product=await Products.updateMany({"name":req.params.name},{
                        $set:{
                                price:req.body.price,
                                Availablequantity:req.body.Availablequantity
                        }
                },{new:true});
                if(!product) return res.status(404).send('Product with given data not found....');
                res.send(await Products.find());
        }
});
router.delete('/:id',[auth,admin],async (req,res)=>{
        const product=await Products.findByIdAndRemove(req.params.id);
        if(!product) return res.status(404).send('The data with given id not found');
        res.send(await Products.find());
});

router.delete('/',[auth,admin],async (req,res)=>{
        if(Object.keys(req.query).length != 0){
                console.log(req.query)
                const product=await Products.findOneAndRemove({'name':req.query.name});
                if(!product) return res.status(404).send('The data with given id not found');
                res.send(await Products.find());
        }else{
                console.log('Delete many')
                const product=await Products.deleteMany();
                console.log(product);
                //if(!product) return res.status(404).send('The data with given id not found');
                res.send(await Products.find());
        }
});

module.exports=router;