var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var koa = require('koa');
var middlewares = require('koa-middlewares');
var staticCache = require('koa-static-cache');
var serve = require('koa-static-folder');
var passport = require('koa-passport');

var config = require('./app/config');
var router = require('./app/router');

var app = koa(); // initial koa application

app.keys = ['duyetdev-quick', 'i like a boss']; // Key server
app.context.db = mongoose.connect(config.db); // Database

// Middlewares
app.use(middlewares.compress());
app.use(middlewares.favicon());
app.use(middlewares.rt());
app.use(middlewares.logger());
app.use(middlewares.bodyParser());

// passport 
app.use(passport.initialize());
app.use(passport.session());

app.context.viewpath = path.join(__dirname, 'views');
app.context.assetspath = path.join(__dirname, 'public');
app.use(serve('./public'));
app.use(staticCache(app.context.assetspath, {
	maxAge: 365 * 24 * 60 * 60
}));

app
  .use(router.routes())
  .use(router.allowedMethods());

// Start application
app = module.exports = http.createServer(app.callback());
if (!module.parent) {
	app.listen(config.port);
	console.info("Listen on http://localhost:%s", config.port);
}
