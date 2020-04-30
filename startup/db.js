const mongoose=require('mongoose');
const winston=require('winston');

module.exports=function(){
    mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,useUnifiedTopology: true})
        .then(()=>winston.info('connection established....')
    );
    mongoose.set('useCreateIndex', true);
}
