'use strict';

/**
* Module dependencies.
*/
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes/routes');

//Init
var app = module.exports = express();

var settings = {
	title: "Ludum 30"
}

//App Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index', {title: "RoboArmadillo"});
});

app.get('/:page', routes.page);



app.listen(3000);