var sio = require('socket.io');

module.exports.listen = function(server) {
    var user = {};
    var chatUser = {};
    var messages = {};
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

    io.of('/chatSocket').on('connection', function(socket) {
        socket.on('chatJoined', function(name) {
            console.log(name + ' joined the chat');
            chatUser[socket.id] = name;
            socket.emit('info', chatUser);
            socket.broadcast.emit('joinAnnouncement', name, socket.id);
        });
        socket.on('disconnect', function() {
            var name = chatUser[socket.id];
            socket.broadcast.emit('leaveAnnouncement', name, socket.id);
            delete chatUser[socket.id];
        });
        socket.on('message', function(message) {
            var name = chatUser[socket.id];

            socket.broadcast.emit('write', name, message);
        });
    });

}
