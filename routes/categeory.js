exports.list = function(req, res) {
	console.log("Madhu");
	req.getConnection(function(err, connection) {

		var query = connection.query('SELECT * FROM categeory', function(err, rows) {
			if (err)
				console.log("madhu in categeory");
			console.log("Error Selecting : %s ", err);

			res.render('categeory', {
				page_title: "categeory-data",
				data: rows
			});


		});
	});
};

module.exports.add = function(req, res) {
	console.log('madhu');
	res.render('add_categeory.ejs', {
		page_title: "categeory"
	});
};

exports.edit = function(req, res) {

	var id = req.params.id;
	console.log(id);
	req.getConnection(function(err, connection) {

		var query = connection.query('SELECT * FROM categeory where No = ?', [id], function(err, rows) {
			if (err)
				console.log("Error selecting : %s", err);
			console.log(rows);
			res.render('edit_categeory', {
				page_title: "Edit categeory",
				data: rows
			});
		});
	});
};


//save the customer
exports.save = function(req, res) {
	console.log('madhu')
	var input = JSON.parse(JSON.stringify(req.body));

	req.getConnection(function(err, connection) {

		var data = {

			Name: input.Name,
			Description: input.Description,
			Status: input.Status

		};
		console.log('save in categeory');

		var query = connection.query("INSERT INTO categeory set ?", data, function(err, rows) {
			console.log('save in categeory2');

			if(err)
			console.log('save in categeory3');


			

			res.redirect('/categeory');
		});
	});
};

exports.save_edit = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;

	req.getConnection(function(err, connection) {

		var data = {
			Name: input.Name,
			Description: input.Description,
			Status: input.Status

		};
		connection.query("UPDATE categeory set ? WHERE No = ? ", [data, id], function(err, rows) {

			if (err) {
				console.log("Error Updating : %s ", err);
			}

			res.redirect('/categeory');
		});
	});
};

exports.delete_users = function(req, res) {

	var id = req.params.id;
	console.log('haiiii, Madhu is here');
	req.getConnection(function(err, connection) {

		connection.query("DELETE FROM categeory WHERE No = ? ", [id], function(err, rows) {
			if (err)
				console.log("Error deleting : %s ", err);

			res.redirect('/categeory');
		});
	});
};