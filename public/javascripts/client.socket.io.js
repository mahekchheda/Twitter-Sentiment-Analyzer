var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
var total = document.getElementById('ss-message');
var love = document.getElementById('statsl');
var hate = document.getElementById('statsh');
socket.on('love-tweet', function(data) {
   $('ul#loveTweet').prepend('<li>'+data.user+': '+ data.text + '</li>');
   if( $("ul#loveTweet li").length > 10 ) {
	$("ul#loveTweet li:last").remove();
   }
   //console.log('Client: Received server message: '+data.text);
});

socket.on('hate-tweet', function(data) {
   $('ul#hateTweet').prepend('<li>'+data.user+': '+ data.text + '</li>');
   if( $("ul#hateTweet li").length > 10 ) {
	$("ul#hateTweet li:last").remove();
   }
   //console.log('Client: Received server message: '+data.text);
});


socket.on('tweet-count',function(data) {
   total.innerHTML = 'Total Tweet Count:: '+data.total;
   love.innerHTML = 'Percentage of "love" in tweets = '+data.love+"%";
   hate.innerHTML = 'Percentage of "hate" in tweets = '+data.hate+"%";
});

