window.onload = function() {
    socket = io.connect('/chatSocket');
    socket.on('connect', function() {
        var name = document.getElementById('sessionUserId').innerHTML;
        socket.emit('chatJoined', name);

        //notify users of joining event
        socket.on('joinAnnouncement', function(name, id) {
            var li = document.createElement('li');
            li.class = 'joinAnnouncement';
            li.id = id + 'j';
            li.innerHTML = name + ' joined the chat room';
            document.getElementById('message').appendChild(li);

            // add name of connected user to online user list
            var i = document.getElementById(id);
            if (!i) {
                var ele = document.createElement('li');
                ele.id = id;
                ele.innerHTML = name;
                document.getElementById('userslist').appendChild(ele);
            }
        });

        //notify users of a leaving event
        socket.on('leaveAnnouncement', function(name, id) {
            var li = document.createElement('li');
            li.class = 'leaveAnnouncement';
            li.id = id + 'l';
            li.innerHTML = name + ' left the chat room';
            document.getElementById('message').appendChild(li);

            // remove user from list of online users
            var ele = document.getElementById(id);
            if (ele) {
                ele.parentNode.removeChild(ele);
            }

        });
    });

    //create and append new messages 
    function addMessage(user, msg) {
        var li = document.createElement('li');
        li.innerHTML = '<strong>' + user + ':</strong> ' + msg;

        //assign class for positioning of messages(left or right align)
        if (user == 'me') {
            li.className = 'self';
        } else {
            li.className = 'other';
        }
        document.getElementById('message').appendChild(li);
        //scroll window to bottom
        window.scrollTo(0, document.body.scrollHeight);
        //pop animation
        $(li).hide().fadeIn(500);
        //pop sound on message
        document.getElementById('pop').play();

    }

    //fetch list of all online users upon connection
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

    //fetch cached messages from an array containing past 20 messages
    function fetchMsgCache(array) {
        for (var key in array) {
            var msgInfo = array[key].split(' ');
            console.log('msgInfo');
            var ele = document.createElement('li');
            ele.id = 'cached' + key;
            if (msgInfo[0] == document.getElementById('sessionUserId').innerHTML) {
                ele.className = 'self';
                ele.innerHTML = '<strong> me :</strong>' + msgInfo[1];
            } else {
                ele.className = 'other';
                ele.innerHTML = '<strong>' + msgInfo[0] + ':</strong>' + msgInfo[1];
            }


            document.getElementById('message').appendChild(ele);
            $(ele).hide().fadeIn(500);
        }
    }

    //on sending a message
    document.getElementById('form').onsubmit = function() {
        var message = document.getElementById('messageText').value;
        if (message) {
            addMessage('me', message);
            socket.emit('message', message);

            document.getElementById('messageText').value = '';
            document.getElementById('messageText').focus();
        }
        //cancel default form submission action = reload
        return false;
    }

    socket.on('write', addMessage);
    socket.on('info', fetchInfo);
    socket.on('fetchCachedMsg', fetchMsgCache);
}
