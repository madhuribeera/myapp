var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
//var routes = require('/routes');
var http = require('http');
//var decode = require('isolate-convert').decode

//load users & categeory
var users = require('./routes/users');
//var categeory = require('./routes/categeory');
var categeory = require('./routes/categeory');
var products = require('./routes/products');
var order = require('./routes/order');
var app = express();


//connection
var connection = require('express-myconnection');
var mysql = require('mysql');

//all Environments
app.set('port' ,process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine' , 'ejs');
app.use(favicon());

app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//development only

if('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.use(
    connection( mysql,{

        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306,
        database: 'nodejs'
    },'pool')

    );

//app.get('/',users.index);
app.get('/users', users.list);
app.get('/users/add', users.add);
app.post('/users/add', users.save);
app.get('/users/delete/:id', users.delete_users);
app.get('/users/edit/:id', users.edit);
app.post('/users/edit/:id', users.save_edit);

// app.get('/',categeory.index);
app.get('/categeory', categeory.list);
app.get('/categeory/add', categeory.add);
app.post('/categeory/add', categeory.save);
app.get('/categeory/delete/:id', categeory.delete_users);
app.get('/categeory/edit/:id', categeory.edit);
app.post('/categeory/edit/:id', categeory.save_edit);


app.get('/products', products.products_list);
app.get('/products/add', products.add);
app.post('/products/add', products.products_save);
app.get('/products/delete/:id', products.products_delete);
app.get('/products/edit/:id', products.products_edit);
app.post('/products/edit/:id', products.products_save_edit);


app.get('/order', order.order_list);
app.get('/order/add', order.add);
app.post('/order/add', order.order_save);
app.get('/order/delete/:id', order.order_delete);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
