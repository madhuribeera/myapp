
var dateTime = require('date-time');


//listing products//

module.exports.products_list = function(req, res) {

	req.getConnection(function(err, connection) {
		var query = connection.query('select p.*, c.Name as categeoryName from products as p left join categeory as c on p.catId = c.No', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				//console.log(rows)
				res.render('products', {page_title: "Products ", data:rows});
			}
		});
	});
}

//add product//

module.exports.add = function(req, res) {
	req.getConnection(function(err, connection) {
		var query = connection.query('select Name, No from categeory where status = "Active"', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.render('add_products.ejs',{page_title:"Add Product - E-Commerce", data: rows});			
			}
		});
	});
	
}


//adding category in database//

module.exports.products_save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));

	console.log(input);

	req.getConnection(function(err, connection) {
		var data;
		if(input.Status === 'active') {
			data = {
				catId 	  : input.No,
				Name          : input.Name,
				Description   : input.Description,
				Price		  : input.Price,
				Quantity  	  : input.Quantity,
				Image         : input.Image,
				Status		  : 'Active'

			}
		} else {
			console.log('Active data');
			data = {
				catId 	  : input.No,
				Name          : input.Name,
				Description   : input.Description,
				Price		  : input.Price,
				Quantity  	  : input.Quantity,
				Image         : input.Image,
				Status        : 'Inactive'

			}
		}
		console.log(data);
		
		var query = connection.query('insert into products set ?', data, function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/products');
			}
		});
	});
}

//editing the product data//

module.exports.products_edit = function(req, res) {
	var id = req.params.id;

	req.getConnection(function(err, connection) {
		var query = connection.query('select * from products where productId = ?', [id],  function(err, rows) {
			if(err) {
				console.log(rows);
				console.log(err);
			} else {
				//console.log('haiiiii')
				var queryCategeory = connection.query('select Name, No from categeory where status = "Active"', function(errCategeory, rowsCategeory) {
					if(errCategeory) {
						console.log(errCategeory);
					} else {
						res.render('edit_products.ejs', {page_title: "Edit Products - E-Commerce" , data:rows, dataCategeory : rowsCategeory});
					}
				});
			}
		});
	});
}


//updating Products data//

module.exports.products_save_edit = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));

	console.log('input');
	console.log(input);
	console.log('input');


	var id = req.params.id;
	console.log(id)
	req.getConnection(function(err, connection) {
		var categeorydata;
		var statusNew = 'Inactive';
		if(input.status && input.status == 'Active'){
			statusNew = 'Active';
		}

		if(input.Image !== ''){
			productsdata = {
				catId 	      : input.No,
				Name          : input.Name,
				Description   : input.Description,
				Price		  : input.Price,
				Quantity  	  : input.Quantity,
				Image         : input.Image,
				Status		  :'Active',
			    updatedon     : dateTime(new Date(), {local: true})
			}
		} else {
			productsdata = {
				catId 	      : input.No,
				Name          : input.Name,
				Description   : input.Description,
				Price		  : input.Price,
				Quantity  	  : input.Quantity,
				Status		  : 'Inactive',
				updatedon     : dateTime(new Date(), {local: true})
			}
		}

		console.log(productsdata);
		console.log('productsdata');


			
		connection.query("update products set ? where productId = ?",[productsdata,id], function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/products');
			}
		});
	});
}


//deleting category data//

module.exports.products_delete = function(req, res) {
	var id  = req.params.id;
	console.log(id);
	req.getConnection(function(err, connection) {
		connection.query("delete from products where productId = ?",[id], function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/products');
			}
		});
	});
}