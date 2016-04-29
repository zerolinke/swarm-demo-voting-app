/**
 * mongodb 连接池
 * Created by lingyuwang on 2016/3/22.
 */

var Pool = require('generic-pool').Pool;
var pool = new Pool({
    name     : 'mongodb',
    create   : function(callback) {
        require('mongodb').MongoClient.connect("mongodb://"+"121.201.18.33"+":"+27017+"/"+"voting", {
            server:{poolSize:1}
        }, function(err,db){
            callback(err,db);
        });
    },
    destroy  : function(db) { db.close(); },
    max      : 10,
    min      : 2,
    idleTimeoutMillis : 30000,
    log : false
});

exports.mongoPool = pool;
