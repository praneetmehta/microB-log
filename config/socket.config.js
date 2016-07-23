var sio = require('socket.io');

module.exports.listen = function(server) {
    var user = {};
    var io = sio.listen(server);
    io.sockets.on('connection', function(socket) {

        socket.on('join', function(name) {
            if (name !== null) {
                console.log(name + ' joined');
                user[socket.id] = name;
                console.log(user);
                socket.emit('fetch', user);
                socket.broadcast.emit('create', user);
            }
        });
        socket.on('disconnect', function() {
            socket.broadcast.emit('delete', socket.id);
            delete user[socket.id];
            console.log(user);

        });
    });

}
