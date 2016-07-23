window.onload = function() {
    /* body... */

    var socket = io.connect();
    socket.on('connect', function() {

        username = document.getElementById('username').value;
        //on connection of the user
        if (username !== null) {
            socket.emit('join', username);
        }
    });

    function Create(array) {
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

    function Delete(id) {
        console.log(id);
        var ele = document.getElementById(id);
        ele.parentNode.removeChild(ele);
    }

    socket.on('create', Create);
    socket.on('delete', Delete);
    socket.on('fetch', Create);


}
