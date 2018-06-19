const redis = require("redis"),
    client = redis.createClient();
    bluebird = require('bluebird')
 
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });
 

 

module.exports = bluebird.promisifyAll(client)
