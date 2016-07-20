/**
 * Created by Roger Felix Yuan on 7/19/2016.
 */

var http = require('http');
var server = http.createServer();
var port = 8080;
var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var url = require('url');
var mongoose = require('mongoose');
var async = require('async');


mongoose.connect('mongodb://127.0.0.1:27017/');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected with MongoDB database");
});


var Schema = mongoose.Schema;
var UrlSchema = new Schema({
        short: String,
        long: String
});

var Data = mongoose.model('urlMapping', UrlSchema);

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, 'www')));

app.get('/', function(req, res) {

    /**
    var record = {
        short: "e",
        long: "mmn"
    };


    var data = new Data(record);
    data.save();
    **/
        /**
    var w = 'mmn';
    Data.find({long : w},{ _id:0, short:0 })
        .then(function(doc) {
        res.send(doc);
    });
    **/
});

app.get('/urlshortener', function(req, res) {
    res.render('index', {title:'paint title'});
});

app.get('/urlshortener/*', function(req, res) {
    var shortURL = "http://localhost:8080" + req.url;
    Data.find({short : shortURL},{ _id:0, short:0 })
        .then(function(doc) {
            var record = doc;
            if(record.length != 0) {
                record = record[0].toString().split("'")[1];
                var longURL = record;
                res.writeHead(301,
                    {Location: longURL}
                );
                res.end();
            } else {
                res.status(404).send("Error: 404 Page Not Found");
            }

        });

});

app.post('/urlshortener', function(req, res) {
    var longURL = "";
    req.on('data',function(data) {
        longURL += data;
        var shortURL = "http://localhost:8080/urlshortener/";
        var record = "";
        Data.find({long : longURL},{ _id:0, long:0 })
            .then(function(doc) {
                record = doc;
                if(record.length == 0) {
                    var ID = generateID();
                    shortURL += ID;
                    var record = {
                        short: shortURL,
                        long: longURL
                    };
                    var data = new Data(record);
                    data.save();
                } else {
                    record = record[0].toString().split("'")[1];
                    shortURL = record;
                }
                res.write(shortURL);
                res.send();
            });
    });
});

app.get('*', function(request, response) {
    response.status(404).send("Error: 404 Page Not Found");
});

function checkLongURLExistence(longURL) {
    Data.find({long : longURL},{ _id:0, short:0 })
        .then(function(doc) {
            return doc;
        });
}

function generateID() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}

server.on('request', app);
server.listen(port, function() {
    console.log('CORS-enabled HTTP web server listening on port ' + port);
});