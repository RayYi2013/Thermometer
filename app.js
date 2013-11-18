// setup server variables
var express = require('express');
var http = require('http');
var path = require('path');
var app = module.exports = express();

//setup express
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//setup thermometer api
app.get('/thermometer',  function(req, res){
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    //return random float between -100 and 100 with 1 decimal
    var temp = ((Math.floor(Math.random() * 2501) - 1000)/10).toFixed(1);
    //temp = 0;
    res.send(200, {temperature:temp});
});

//run server at port 3000.
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
