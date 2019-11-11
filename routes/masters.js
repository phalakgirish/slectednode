const express= require('express');
const router= express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');

const config  = require('../config/database');
const crud=require('../crud');
var async = require('async');
router.post('/addmaster',(req,res,next)=>{
    //var otp=Math.floor(Math.random() * Math.floor(1000000));
		//console.log(req.body);

	    crud.data2("master","master_type,master_name,master_value",`'${req.body.master_type}','${req.body.master_name}','${req.body.master_value}'`,function(error,result){
		//console.log(result);
			if(!error)
			{
				res.send(result);
			}	
		})
	//res.send('111');
});

router.get('/checkEmail',(req,res,next)=>{
   
});


router.post("/getMaster",function(req,res,next){
	//console.log(req.body)
	id=req.body.master_type;
	//console.log(id);
	crud.data1("master_value,master_name","master",`master_type='${id}'`,function(error,result){
		//console.log(result);
		if(!error)
		{	//console.log(result);
			res.send(result);
		}	

	})
});

router.get("/getSkill",function(req,res,next){
	//console.log(req.body)
	id=req.body.master_type;
	//console.log(id);
	crud.data1("skill_id,skill_name","skill","1",function(error,result){
		//console.log(result);
		if(!error)
		{	//console.log(result);
			res.send(result);
		}	

	})
});

router.post("/getSkillfilter",function(req,res,next){
	//console.log(req.body)
	id=req.body.skill;
	console.log(id);
	crud.data1("skill_id,skill_name","skill",`skill_name LIKE '${req.body.skill}%'`,function(error,result){
		console.log(result);
		if(!error)
		{	//console.log(result);
			res.send(result);
		}	

	})
});



router.get("/node_category",function(req,res){
    
	config.query("select * from category", function (error, results) {
					  	if(!error)
					  	{
					  		// console.log(results);
					  		res.send(results)
					  		// callback(null,results);
					  	}
					  	else
					  	{
					  		// callback(error,null);
					  		// res.send("User add");
					  		console.log(error)
					  	}	
					}); 
})
module.exports=router