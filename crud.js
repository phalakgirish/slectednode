var mysql = require('mysql');
const config  = require('./config/database');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'test'
// });

X1=function(col,table,condition=1,callback)
{
	var str=`select ${col} from ${table} where ${condition}`;
	config.query(str, function (error, results, fields) {
					  	if(!error)
					  	{
					  		//console.log(error);
					  		callback(null,results);
					  	}
					  	else
					  	{
					  		callback(error,null);
					  		//res.send("User add");
					  	}	
					}); 
}

X2=function(table,col,value,callback)
{
	var str=`insert into ${table}  (${col}) value (${value})`;
	config.query(str, function (error, results, fields) {
					  	if(!error)
					  	{
					  		//console.log(results);
					  		callback(null,results);
					  	}
					  	else
					  	{
					  		callback(error,null);
							//res.send("User add");
							  
					  	}	
					}); 
}

X3=function(table,data,condition,callback)
{
	var str=`update ${table} SET (${data}) where (${condition})`;
	config.query(str, function (error, results, fields) {
					  	if(!error)
					  	{
					  		console.log(results);
					  		//callback(null,results);
					  	}
					  	else
					  	{
					  		callback(error,null);
							//res.send("User add");
							  
					  	}	
					}); 
}
module.exports={ data1:X1,data2:X2,data3:X3}