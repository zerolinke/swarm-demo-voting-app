/**
 *
 * Created by FeidD on 4/28/16.
 */
var express = require('express'),
    async = require('async'),
// pg = require("pg"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
    mongoPool = require("./lib/db/mongodb").mongoPool;

io.set('transports', ['polling']);

var port = process.env.PORT || 4000;

io.sockets.on('connection', function (socket) {

    socket.emit('message', {text: 'Welcome!'});

    socket.on('subscribe', function (data) {
        socket.join(data.channel);
    });
});

async.retry(
    {times: 1000, interval: 1000},
    function (callback) {
        // pg.connect('postgres://postgres@db/postgres', function(err, client, done) {
        //     if (err) {
        //         console.error("Failed to connect to db");
        //     }
        //     callback(err, client);
        // });
        
        
        console.log("task");
        callback()
    },
    function () {

        console.log("callbacke");
        getVotes();

    }
// function(err, client) {
// if (err) {
//     return console.err("Giving up");
// }
// console.log("Connected to db");
// getVotes();
)
;

function getVotes() {
    console.log("getVotes");
// function getVotes(client) {
//     client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], function(err, result) {
//         if (err) {
//             console.error("Error performing query: " + err);

//         } else {
//             var data = result.rows.reduce(function(obj, row) {
//                 obj[row.vote] = row.count;
//                 return obj;
//             }, {});
    var aCount = 0;
    var bCount = 0;
    mongoPool.acquire(function(err, db) {
        if (err) {
            console.log(err);
        } else {
            async.parallel([
                function (callback) {
                    db.collection("vote").count({vote:"a"},function(err, docs) {
                        aCount = docs;
                        console.log("aCount -> "+aCount);
                        callback(null);
                    });
                },function (callback) {
                    db.collection("vote").count({vote:"b"}, function(err, docs) {
                        bCount = docs;
                        console.log("bCount -> "+bCount);
                        callback(null);
                    });
                }
            ],function (err, result) {
                mongoPool.release(db); // 释放连接
                console.log("aCount -> "+aCount);
                console.log("bCount -> "+bCount);
                io.sockets.emit("scores", JSON.stringify({"a": aCount, "b": bCount}));
//             io.sockets.emit("scores", JSON.stringify(data));
//         }
//
                setTimeout(function () {
                    getVotes()
                }, 1000);
            });
        }
    });
    
//     });
    
}

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

server.listen(port, function () {
    var port = server.address().port;
    console.log('App running on port ' + port);
});

