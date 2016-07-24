window.onload = function() {
    socket = io.connect('/chatSocket');
    socket.on('connect', function() {
        var name = document.getElementById('sessionUserId').innerHTML;
        socket.emit('chatJoined', name);

        socket.on('joinAnnouncement', function(name, id) {
            var li = document.createElement('li');
            li.class = 'joinAnnouncement';
            li.id = id + 'j';
            li.innerHTML = name + ' joined the chat room';
            document.getElementById('message').appendChild(li);

            var i = document.getElementById(id);
            if (!i) {
                var ele = document.createElement('li');
                ele.id = id;
                ele.innerHTML = name;
                document.getElementById('userslist').appendChild(ele);
            }
        });

        socket.on('leaveAnnouncement', function(name, id) {
            var li = document.createElement('li');
            li.class = 'leaveAnnouncement';
            li.id = id + 'l';
            li.innerHTML = name + ' left the chat room';
            document.getElementById('message').appendChild(li);

            var ele = document.getElementById(id);
            if (ele) {
                ele.parentNode.removeChild(ele);
            }

        });
    });

    function addMessage(user, msg) {
        var li = document.createElement('li');
        li.innerHTML = '<strong>' + user + ':</strong> ' + msg;

        if (user == 'me') {
            li.className = 'self';
        } else {
            li.className = 'other';
        }
        document.getElementById('message').appendChild(li);
        window.scrollTo(0, document.body.scrollHeight);

        $(li).hide().fadeIn(300);
        document.getElementById('pop').play();

    }

    function fetchInfo(array) {
        for (var key in array) {
            var value = array[key];
            var i = document.getElementById(key);
            if (!i) {
                var ele = document.createElement('li');
                ele.id = key;
                ele.innerHTML = value;
                document.getElementById('userslist').appendChild(ele);
            }
        }
    }

    document.getElementById('form').onsubmit = function() {
        var message = document.getElementById('messageText').value;
        if (message) {
            addMessage('me', message);
            socket.emit('message', message);

            document.getElementById('messageText').value = '';
            document.getElementById('messageText').focus();
        }
        return false;
    }

    socket.on('write', addMessage);
    socket.on('info', fetchInfo);
}
