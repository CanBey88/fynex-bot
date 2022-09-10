const redis = require('redis');
const config = require('../config');
const sub = redis.createClient(config.REDIS.port, config.REDIS.host);
const pub = redis.createClient(config.REDIS.port, config.REDIS.host);

sub.subscribe('spread');

module.exports = io => {
  io.on('connection', socket => {
    /* To find the User Login  */
    let passport = socket.handshake.session.passport; 

    if (typeof passport !== 'undefined') {
      socket.on('typing:send', data => {
        pub.publish('spread', JSON.stringify(data));
      });

      sub.on('message', (ch, msg) => {
        // This is the Exact line where I am getting this error
        io.emit(`${JSON.parse(msg).commonID}:receive`, { ...JSON.parse(msg) });
      });
    }
  });
};