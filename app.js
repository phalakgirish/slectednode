const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const cors =require('cors');
const passport = require('passport');
// const mysql = require('mysql');

const users=require('./routes/users');
const masters=require('./routes/masters');
const app= express();

var mysql   = require('mysql'),
    config  = require("./config/database");
app.use(cors());
app.use(express.json()) 
app.use (express.urlencoded({extended: false}))
// parse application/json
var Client = require('node-rest-client').Client;
var client = new Client();
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static('./uploads/'));
app.use(express.static(__dirname + './uploads/'));

app.use('/users',users);
app.use('/masters',masters);
//error handler
app.use((err,req,res,next)=>{
    if(err.name=='ValidationError')
    {
        var valErrors=[];
        Object.keys(err.errors).forEach(key=>valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});
app.get('/getdata',function(req,res){
	
	config.query("select * from category",function(error,result,fields){
		if(!error)
		{
			console.log(error);
			//callback(null,results);
		}
		else
		{
			//callback(error,null);
			res.send("User add");
		}	
	});
    
});

app.get("/",(req,res)=>{
	res.send("Invalid endpoint");
});
const port=3000;
app.listen(port,()=>{
	console.log('Server started at port no '+port)
});