var app = require('express').createServer()
  , io = require('socket.io').listen(app);
var active_users = 0;
var all_time_users = 0;

app.listen(14841);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/styles.css', function (req, res) {
  res.sendfile(__dirname + '/styles.css');
});


io.set('log level', 1);
io.sockets.on('connection', function (socket) {
   active_users++;
   all_time_users++;
   
   socket.broadcast.emit('users_update', {num_users : active_users});
   
   socket.emit('welcome', {id : "guest" + all_time_users, num_users : active_users});
   
   socket.on('msg', function (data) {
      socket.broadcast.emit('msg', data);
   });
   
   socket.on('disconnect', function (data) {
      active_users--;
      socket.broadcast.emit('users_update', {num_users : active_users});
   });
});



