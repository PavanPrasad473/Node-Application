const express=require('express');
let config=require('config');
const app=new express();
const winston=require('winston')
require('./startup/logging')();
require('./startup/db')();
console.log('Helooo');
console.log(config.get('jwtPrivateKey'));
require('./startup/config')();
require('./startup/validation')();
require('./startup/routes')(app);


// app.set('view engine','pug');
// app.set('views','./views');

const port=process.env.port || 3000;
app.listen(port,()=>winston.info(`listening to port...${port}`));