var dateTime = require('date-time');
exports.list = function(req, res) {
	console.log("Madhu");
	req.getConnection(function(err, connection) {

		var query = connection.query('SELECT * FROM users', function(err, rows) {
			if (err)
				console.log("madhu in users");
				console.log("Error Selecting : %s ", err);

			res.render('users', {
				page_title: "users-data",
				data: rows
			});


		});
	});
};

module.exports.add = function(req, res){
	console.log('madhu');
	res.render('add_users.ejs',{page_title:"Customers"});
};

exports.edit = function(req,res){

	var id = req.params.id;
		console.log(id);
	req.getConnection(function(err,connection){

		var query = connection.query('SELECT * FROM users where No = ?', [id],function(err,rows){
			if(err)
				console.log("Error selecting : %s",err);
			console.log(rows);
			res.render('edit_users.ejs',{page_title: "Edit users" , data:rows});
		});
	});
};


//save the customer
exports.save = function(req,res){
	console.log('madhu')
	var input = JSON.parse(JSON.stringify(req.body));

	req.getConnection(function(err,connection) {

		var data = {

			Name : input.Name,
			Email : input.Email,
			Phone : input.Phone,
			City : input.City,
			State: input.State,
			Country: input.Country,
			Zipcode : input.Zipcode,
			
		};

		var query = connection.query("INSERT INTO users set ?",data,function(err,rows){

			if(err)
				console.log("Error inserting : %s ", err);

			res.redirect('/users');
		});
	});
};

exports.save_edit = function(req,res){

	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;

	req.getConnection(function (err,connection) {

		var  data = {
			Name : input.Name,
			Email : input.Email,
			Phone : input.Phone,
			City : input.City,
			State: input.State,
			Country: input.Country,
			Zipcode: input.Zipcode,
			updatedon:dateTime(new Date(), {local: true})
		};
		connection.query("UPDATE users set ? WHERE No = ? ",[data,id], function(err, rows){

			if(err) {
				console.log("Error Updating : %s " ,err);
			}

			res.redirect('/users');
		});
	});
};

exports.delete_users = function(req,res){

	var id = req.params.id;
	console.log('haiiii, Madhu is here');
	req.getConnection(function(err, connection) {

		connection.query("DELETE FROM users WHERE No = ? ", [id], function(err, rows){
			 if(err)
			 	console.log("Error deleting : %s " ,err);

			 res.redirect('/users');
		});
	});
};