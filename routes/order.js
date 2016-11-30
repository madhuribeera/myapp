var dateTime = require('date-time');
var productsdata = [];
var orderbaseprice = {};

//listing order//

module.exports.order_list = function(req, res) {

	req.getConnection(function(err, connection) {
		var query = connection.query('select o.orderid , o.totalPrice,o.orderStatus,u.Name as users,p.Name as products,c.Name as categeory FROM `order` as o LEFT JOIN users as u on o.userno = u.No LEFT JOIN products as p on o.productId = p.productId LEFT JOIN categeory as c on p.catId = c.No', function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				//console.log(rows)
				res.render('order', {
					page_title: "order ",
					data: rows
				});
			}
		});
	});
}

//add order//

module.exports.add = function(req, res) {
	req.getConnection(function(err, connection) {
		var query = connection.query('select Name, productId,Price,Quantity from products where status = "Active"', function(err, rows) {
			if (err) {
				console.log(err);
			} else {

				productsdata = rows;
				var query1 = connection.query('select Name,No from users', function(err, rows1) {
					if (err) {
						console.log("Error Selecting : %s", err);
					} else {
						res.render('add_order.ejs', {
							page_title: " Add Order",
							productsdata: rows,
							userdata: rows1
						});
					}
				});
			}
		});
	});
};


//adding category in database//

module.exports.order_save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));

	console.log(input);
	

	req.getConnection(function(err, connection) {

		for (var i = 0; i < productsdata.length; i++) {
			if (productsdata[i].productId == input.productId) {
				orderbasePrice = {
					porderid: productsdata[i].productId,
					pbasePrice: productsdata[i].Price,
					pQuantity: productsdata[i].Quantity

				}
			}
		}
		console.log("------orderbaseprice------------");
		console.log(orderbasePrice)
		var Status;
		var totalPrice = (orderbasePrice.pbasePrice) * input.Quantity;

		if (input.Quantity >= orderbasePrice.pQuantity) {
			Status = "pending";
		} else {
			Status = "completed"
			req.getConnection(function(err, connection) {
				console.log("----------(50)-------orderbasePrice.pQuantity")
				console.log(orderbasePrice.pQuantity)
				var actualQuantity = {
					Quantity: orderbasePrice.pQuantity - input.Quantity
				}
				console.log("-orderbasePrice.porderid")

				console.log(orderbasePrice.porderid)
				var query = connection.query("UPDATE products set ? WHERE productId = ? ", [actualQuantity, orderbasePrice.porderid], function(err, rows) {

					if (err)
						console.log("Error Selecting : %s ", err);


					console.log('product table updated')


				});


			});


		}
		console.log("--------------------------------------")

		var data = {
			productId: input.productId,
			userno: input.No,
			basePrice: orderbasePrice.pbasePrice,
			orderStatus: Status,
			orderdate: dateTime(new Date(), {
				local: true
			}),
			totalPrice: totalPrice,
			Quantity: input.Quantity
		};

			console.log(data);
			console.log('data');


		var query = connection.query("INSERT INTO `order` set ? ", [data], function(err, rows) {

			if (err)
				console.log("Error inserting : %s ", err);

			res.redirect('/order');

		});

	});
};


//editing the product data//

module.exports.order_edit = function(req, res) {
	var id = req.params.id;

	req.getConnection(function(err, connection) {
		var query = connection.query('select * from order where orderId = ?', [id], function(err, rows) {
			if (err) {
				console.log(rows);
				console.log(err);
			} else {
				//console.log('haiiiii')
				var queryCategeory = connection.query('select Name, No from categeory where status = "Active"', function(errCategeory, rowsCategeory) {
					if (errCategeory) {
						console.log(errCategeory);
					} else {
						res.render('edit_order.ejs', {
							page_title: "Edit Products - E-Commerce",
							data: rows,
							dataCategeory: rowsCategeory
						});
					}
				});
			}
		});
	});
}




exports.order_save_edit = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var catid = req.params.id;

	req.getConnection(function(err, connection) {
		var data;

		if (input.Active == 'Active') {
			data = {

				Name		: input.Name,
				Description : input.Description,
				updatedon   : dateTime(new Date(), {
				local		: true
				}),

				status      : 'Active'
			};
		} else {
			data = {

				Name        : input.Name,
				Description : input.Description,
				updatedOn   : dateTime(new Date(), {
				local       : true
				}),
				Status      : 'Inactive'
			};
		}

		connection.query("UPDATE categeory set ? WHERE No = ? ", [data, No], function(err, rows) {

			if (err)
				console.log("Error Updating : %s ", err);

			res.redirect('/categeory');


		});

	});
};



//deleting category data//

exports.order_delete = function(req, res) {
	var orderid = req.params.id;
	req.getConnection(function(err, connection) {
		connection.query("delete from `order` where orderid = ?", [orderid], function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/order');
			}
		});
	});
}