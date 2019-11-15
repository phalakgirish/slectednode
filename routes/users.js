const express= require('express');
const router= express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');

const config  = require('../config/database');
const crud=require('../crud');
var async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' });


router.post('/upload', multipartMiddleware, (req, res) => {
	console.log(req.files.uploads[0]['path']);
	//console.log(req.files);

	str=`UPDATE users SET user_profileimg='${req.files.uploads[0]['path']}' WHERE user_id='${req.body.user_id}'`;
	config.query(str, function (error, results) {
					  	if(!error)
					  	{
					  		// console.log(results);
					  		//res.send(req.files.uploads[0]['path'])
					  		// callback(null,results);
					  		res.json({
						        'message': req.files.uploads[0]['path']
						    });
					  	}
					  	else
					  	{
					  		// callback(error,null);
					  		// res.send("User add");
					  		console.log(error)
					  	}	
					});
	//res.send(req.files.uploads);
	//res.send(req.file.uploads);
    // res.json({
    //     'message': req.files.uploads[0]['path']
    // });
});


/*Register Routs*/
router.post('/register',(req,res,next)=>{

	crud.data1("count(*) as cnt","users",`user_email='${req.body.user_email}'`,function(error,result)
	{
		
		if(result[0].cnt > 1)
		{
			//res.status(400);
			//console.log(result[0].cnt);
			res.status(422).send("Duplicate User Found");
			//res.status(422);
		}	
		else
		{

			//res.send(JSON.stringify("Insert"));
					bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
						
					// Store hash in your password DB.
					if(!err){

						 crud.data2("users","user_name,user_email,user_pass,user_loginwith,user_verify",`'${req.body.fullname}','${req.body.user_email}','${hash}','website','No'`,function(error2,result2){
						 	
							  if(!error2)
							  {
								  //res.send(JSON.stringify("Login"));
								  crud.data1("user_id,user_name,user_email","users",`user_email='${req.body.user_email}'`,function(error1,rss)
									{
										// console.log(token);
										if(!error1)
										{
											token = jwt.sign({
										        data: {uid:rss[0].user_id,email:rss[0].user_email,status:1,fullname:rss[0].user_name}
										      }, 'hellowrold', { expiresIn: 60 });
											//console.log(token);
										    res.send(JSON.stringify(token))
											//res.send(result);
											
										}	
									});
							  }
							  else
							  {
							  	console.log(error2);
							  	//res.send(JSON.stringify("User not register."));
							  	//res.status(422).send("Invalid User");
							  }	
						  })  
					}
					else
					{
						 console.log(err);
					}	
				  });

		}	
			

	});
});
/* Check email exist or not*/
router.post('/checkEmail',(req,res,next)=>{
	crud.data1("count(*) as cnt,user_id,user_name,user_email","users",`user_email='${req.body.user_email}'`,function(error,result)
	{
		//console.log(result[0].cnt);
		emailId=req.body.user_email;
		//console.log(emailId);
		if(!error)
		{
			//res.send(result);
			if(result[0].cnt > 0)
			{
				//token = {'uid':result[0].user_id,'email':result[0].user_email,'status':1,'fullname':result[0].user_name};
                //res.send(JSON.stringify(token));

                token = jwt.sign({
		        data: {uid:result[0].user_id,email:result[0].user_email,status_id:1,fullname:result[0].user_name}
		      }, 'hellowrold', { expiresIn: 60 });
			//console.log(token);
		    res.send(JSON.stringify(token))


				/*If user exist*/
				//res.send('1');
				
			}
			else
			{
				 token = jwt.sign({
		        data: {email:emailId,status_id:0}
		      }, 'hellowrold', { expiresIn: 60 });
			//console.log(token);
		    res.send(JSON.stringify(token))

				
				//token ={'email':emailId,'status':0};
                //res.send(JSON.stringify(token));
				/*If user not exist */
				//res.send('0');
			}
		}	
	});
});

/*Login Action*/
/*Register Routs*/
router.post('/login',(req,res,next)=>{


	crud.data1("user_id,user_name,user_email,user_pass","users",`user_email='${req.body.email}'`,function(error,result)
	{
		//console.log(result.length);
		if(!error)
		{
			//res.send(result);
			if(result.length > 0)
			{
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					// Store hash in your password DB.
					if(!err){
						dbpass = result[0].user_pass;
						userpass=req.body.password;

						bcrypt.compare(userpass, dbpass, function(err, result_from_crypt) {
							//res.send("1");
							console.log(result_from_crypt);
							// console.log(result_from_crypt);
							if(result_from_crypt==true)
							{
								token = jwt.sign({
		        						data: {uid:result[0].user_id,email:result[0].user_email,status:1,fullname:result[0].user_name}
		      							}, 'hellowrold', { expiresIn: 60 });			
								res.send(JSON.stringify(token));
							}
							else
							{
								res.status(422).send('Ungültiger Login');
							}
							
						});
					}
				  });
			}
			else
			{
				res.status(422).send("email does not exist");
			}
		}
		else
		{
			res.status(422).send(error);
		}	

	});
});


router.post("/filter_cat_route",function(req,res,next){
	console.log(req.body)
	id=req.body;
	console.log(id);
	crud.data1("*","product",`pro_catid='${id}'`,function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})
});
/*Add users skills*/
router.post('/adduserskill',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body.candidateSkill.length);
	//req.body.length
	id=req.body;
	// console.log(id.user_id);
	// console.log(id.candidateSkill.user_id);


	//console.log(req.body.length);
	req.body.candidateSkill.forEach(function(value){
	  //console.log(value.user_id);

	  crud.data1("count(*)as cnt","userskill",`userskill_userid='${value.user_id}'AND userskill_skillid='${value.candidateSkill}'`,function(error,result){
		//console.log(result[0].cnt);
		if(!error)
		{
			if(result[0].cnt < 1)
			{
				crud.data2("userskill","userskill_userid,userskill_skillid",`'${value.user_id}','${value.candidateSkill}'`,function(error1,result1){
					//console.log(result);
						if(!error1)
						{
							//res.send( "skill added");
							res.send(result1);
							
						}	
						else
						{
							console.log(error1);
						}	
				});
			}
			else
			{
				// res.json({
				// 		    'message': "Skill not added"
				// });
			}	
			
		}	

		})
	});
	// for(var m=0; m<3; m++)
	// {
	// 	//console.log(id[i].candidateSkill);	
	// 	console.log(m);
		



		
	// }	

	// crud.data2("userskill","userskill_userid,userskill_skillid",`'${req.body.user_id}','${req.body.candidateSkill}'`,function(error,result){
	// 	//console.log(result);
	// 		if(!error)
	// 		{
	// 			res.send("skill added");
	// 		}	
	// 		else
	// 		{
	// 			console.log(error);
	// 		}	
	// });

});

router.get('/compareData',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body.user_id;
	//console.log(id);
	crud.data1("user_id,user_name,user_profileimg,rating_pro,rating_qual,rating_exp,rating_area,rating_avt,rating_salary,job_company,job_position","users,rating,job","user_id=rating_userid AND job_userid=user_id AND job_current='true'",function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	
		else
		{
			res.send(result);
		}	

	})
});

router.post('/FiltercompareData',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body.rating_area;
	//console.log(id);
	// crud.data1("user_id,user_name,user_profileimg,rating_pro,rating_qual,rating_exp,rating_area,rating_avt,rating_salary,job_company,job_position",`users,rating,job","user_id=rating_userid AND job_userid=user_id AND job_current="true"`,function(error,result){
	// 	//console.log(result);
	// 	if(!error)
	// 	{
	// 		res.send(result);
	// 	}	
	// 	else
	// 	{
	// 		res.send(error);
	// 	}	

	// })
	crud.data1("user_id,user_name,user_profileimg,rating_pro,rating_qual,rating_exp,rating_area,rating_avt,rating_salary,job_company,job_position","users,rating,job",`user_id=rating_userid AND job_userid=user_id AND job_current='true' AND rating_area='${id}'`,function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	
		else
		{
			res.send(result);
		}	

	})
});

router.post('/getuserskill',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body.user_id;
	//console.log(id);
	crud.data1("userskill_id,userskill_userid,userskill_skillid","userskill",`userskill_userid='${req.body.user_id}'`,function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})
});
router.post('/updatePersonalData',(req,res)=>{
	id=req.body;
	str=`UPDATE users SET user_name='${req.body.user_name}',user_email='${req.body.user_email}',user_bob='${req.body.user_bob}' WHERE user_id='${req.body.user_id}'`;
	config.query(str, function (error, results) {
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

});

router.get('/imgPath',(req,res)=>{
	crud.data1("user_id,user_name,user_email,rating_avt,rating_pro,rating_qual,rating_exp,rating_salary,user_bob,user_verify,user_salary,user_profileimg","rating,users","user_id=rating_userid AND user_id='2'",function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})
});
router.post('/getuserdata',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	//console.log(id);
	crud.data1("user_id,user_name,user_email,rating_avt,rating_pro,rating_qual,rating_exp,rating_salary,user_bob,user_verify,user_salary,user_profileimg","rating,users",`user_id=rating_userid AND user_id='${req.body.user_id}'`,function(error,result){
		//console.log(result);

		if(!error)
		{
			res.send(result);
		}	

	})
});
router.post('/getjobdata',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	//id=req.body;
	//console.log(id);
	crud.data1("job_id,job_company,job_position,job_period_from,job_period_to,job_current","job",`job_userid='${req.body.user_id}' order by job_id desc`,function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})
});

/*Add users skills*/
router.post('/adduserlocation',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	//console.log(id);
	crud.data2("job","job_userid,job_company,job_position,job_period_from,job_period_to,job_current",`'${req.body.job_userid}','${req.body.job_company}','${req.body.job_position}','${req.body.job_period_from}','${req.body.job_period_to}','${req.body.job_current}'`,function(error,result){
		console.log(result);
			if(!error)
			{
				res.send(result);
			}	
	});

});

/*Add users skills*/
router.post('/usercurrentCompany',(req,res)=>{
	id=req.body;
	//console.log(id);
	crud.data1("job_company,job_position,job_period_from,job_period_to,job_current","job",`job_current='true' AND job_userid='${req.body.user_id}' ORDER BY job_id DESC LIMIT 1`,function(error,result){
		//console.log(result);
		if(!error)
		{	
			//console.log(result);
			if(result.length > 0)
			{
				res.send(result);	
			}	
			else
			{
				//console.log("Data not found");
				res.send("no");
			}
			
		}	

	})

});
router.post('/userprivousCompany',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	//console.log(id);
	crud.data1("job_company,job_position,job_period_from,job_period_to,job_current","job",`job_current ='false' OR job_current ='' AND job_userid='${req.body.user_id}' ORDER BY job_id DESC`,function(error,result){
		//console.log(result);
		if(!error)
		{
			//res.send(result);
			if(result.length > 0)
			{
				res.send(result);	
			}	
			else
			{
				//console.log("Data not found");
				res.send("no");
			}
		}	

	})

});
/*Add users skills*/
router.post('/adduserEducation',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	//console.log(id);
	crud.data2("education","edu_userid,edu_univesity,edu_subject,edu_graduation,edu_year",`'${req.body.userid}','${req.body.university}','${req.body.subject}','${req.body.graduation}','${req.body.year}'`,function(error,result){
		//console.log(result);
			if(!error)
			{
				res.send("education added");
			}	
	});

});

/*Add users skills*/
router.post('/getuserEducation',(req,res)=>{
	//res.send('getSkill');
	console.log(req.body);
	id=req.body;
	crud.data1("edu_userid,edu_univesity,edu_subject,edu_graduation,edu_year","education",`edu_userid='${req.body.user_id}'`,function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})

});

router.post('/adduserRating',(req,res,next)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	//console.log(id);
	crud.data2("rating","rating_userid,rating_pro,rating_qual,rating_exp,rating_area,rating_avt",`'${req.body.rating_userid}','${req.body.rating_pro}','${req.body.rating_qual}','${req.body.rating_exp}','${req.body.rating_area}','${req.body.rating_avt}'`,function(error,result){
		//console.log(result);
			if(!error)
			{
				//callback(null,results);
				res.send('Add');
			}	
			else
			{
				res.send('Add');
			}	
	});

});
router.get('/compaireData',(req,res,next)=>{
	crud.data1("user_id,user_name,rating_area,rating_avt,job_company,job_position","users,rating,job","user_id=rating_userid AND user_id=job_userid AND job_current='true'",function(error,result){
		//console.log(result);
		if(!error)
		{
			res.send(result);
		}	

	})

});
router.post('/useTotExp',(req,res,next)=>{

	crud.data1("*","rating",`rating_userid='${req.body.user_id}' LIMIT 1`,function(error,result){
		//console.log(result);
		if(!error)
		{
			if(result.length > 0)
			{
				res.send(result);
			}	
			else
			{
				res.send("0");
			}
		}	

	})

});
router.post('/updateSalary',(req,res)=>{
	//res.send('getSkill');
	console.log(req.body);
	id=req.body;
	//console.log(id);
	// crud.data1("user_id,user_name,user_email,rating_avt,rating_salary,user_bob,user_verify,user_salary","rating,users",`user_id=rating_userid AND user_id='${req.body.user_id}'`,function(error,result){
	// 	//console.log(result);
	// 	if(!error)
	// 	{
	// 		res.send(result);
	// 	}	

	// })
	//str=`select * from eshoper_user where email='${req.body.eshop_email}'`;
	str=`UPDATE users SET user_salary='${req.body.user_salary}' WHERE user_id='${req.body.user_id}'`;
	config.query(str, function (error, results) {
					  	if(!error)
					  	{
					  		console.log(results);
					  		res.send(results)
					  		// callback(null,results);
					  	}
					  	else
					  	{
					  		// callback(error,null);
					  		res.send("User add");
					  		//console.log(error)
					  	}	
					}); 

});

router.post('/updatePassword',(req,res)=>{
	//res.send('getSkill');
	//console.log(req.body);
	id=req.body;
	bcrypt.hash(req.body.user_pass, saltRounds, function(err, hash) {
					// Store hash in your password DB.
					if(!err){
						// res.send(hash)
						// 	str = `insert into userinfo (login_name,login_mobile,login_email,login_password) values ('${req.body.eshop_name}','${req.body.eshop_mobile}','${req.body.eshop_email}','${hash}') `;
							
						// 	connection.query(str, function (error, results, fields) {
						// 		if(error){
						// 			console.log(error);
						// 			return false;
						// 		}
						// 		else{
						// 			res.send("User Added");
						// 		}
						//   });
						//console.log(req.body);
						 

						  str=`UPDATE users SET user_pass='${hash}' WHERE user_id='${req.body.user_id}'`;
							config.query(str, function (error, results) {
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

					}
				  });
	

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
					  		res.send(error)
					  	}	
					}); 
})
module.exports=router