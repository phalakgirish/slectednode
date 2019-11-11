var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'slecteddb.cenxy5zzeiun.us-east-2.rds.amazonaws.com',
    user     : 'slectedAdminUser',
    password : 'slectedAdminUser',
    database : 'slectedbd'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
