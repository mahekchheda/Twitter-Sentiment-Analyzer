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

//Twitter credentials to connect with twitter API
var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

// To setup socket.io
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

// Variables to store information about tweets
var counts = {love:0,hate:0,total:0};
var percent = {love:0,hate:0};
var sio = require('socket.io').listen(server);

//Handling the computation and analyzing part
sio.sockets.on('connection', function(socket) {
	console.log('Web Client connected');

	//Capture streams containing "love/hate"
	twit.stream('statuses/filter',{ track: ['love','hate'] },function(stream) {
		stream.on('data', function(tweet) {
		console.log(tweet.text);	// Print text of tweet

		//Check if tweet has love
		if (tweet.text.indexOf('love') > -1)
		{
			counts.love += 1;	//Update counter for love
			counts.total+=1;
			socket.broadcast.emit('love-tweet',{user: tweet.user.screen_name, text: tweet.text});	//Send this tweet to client stating this needs to be placed in love column
 		}// Check if tweet has hate
 		if (tweet.text.indexOf('hate') > -1)
 		{
			counts.hate += 1;	//Update the counter
			counts.total+=1;
			socket.broadcast.emit('hate-tweet',{user: tweet.user.screen_name, text: tweet.text});	//Send this tweet to client to push this into hate column
		}
		//Calculate percentage
		percent.love = (counts.love/counts.total)*100;
		percent.hate = (counts.hate/counts.total)*100;
		//console.log(percent);
		// Send the statistics to the client
		socket.broadcast.emit('tweet-count',{love:percent.love,hate:percent.hate,total:counts.total});
	});
	});
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
