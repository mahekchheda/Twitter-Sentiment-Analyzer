var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var twitter = require('ntwitter');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var t = new twitter({
  consumer_key: 'csBJt4oZXmNBOBXm9D63zME0x',
  consumer_secret: '0dAy0lmFcflFjQp4WLKuAKwUaxiVr7UK3QDnGnnenxFGXRAkah',
  access_token_key: '141646732-PWJ0jcfEnXXGwnsunvN3p6lt0Cjd5Thh4Zcx5AWr',
  access_token_secret: 'TzMznFP2Jf7JTBmUQpExvz5xn2TNAiaPXQFh8rNOZgYW9'
});

var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

//var counts;
var sio = require('socket.io').listen(server);
sio.sockets.on('connection', function(socket) {
	console.log('Web Client connected');
	t.stream(
		'statuses/filter',
		{ track: ['love','hate'] },
		function(stream) {
			stream.on('data', function(tweet) {
				console.log(tweet.text);
/*				if (tweet.text.indexOf('love') > -1)
				{
					counts.love += 1;
 				}
 				if (tweet.text.indexOf('hate') > -1)
 				{
					counts.hate += 1;
				}
				console.log(counts);
				//socket.volatile.emit('ss-tweet',{user: tweet.user.screen_name, text: tweet.text});
				//socket.volatile.emit('ss-counts', counts);*/
			});
		}
	);
	socket.on('disconnect', function() {
		console.log('Web client disconnected');
	});
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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


module.exports = app;
