document.addEventListener('DOMContentLoaded', () => {
    var baseURL = location.protocol + '//' + document.domain + ':' + location.port;
    var socket = io.connect(baseURL);

    var username = document.querySelector('#get-username').innerHTML;

    var room = document.querySelector('#current_room').innerHTML;

    joinRoom(room);

    socket.on('connect', function() {
        console.log('Connected to server');
    })

    socket.on('message', data => {
            var p = document.createElement('p');
            var br = document.createElement('br');
            p.innerHTML = data['username'] + ": " + data['message'];
            p.style.color = "red";
            document.querySelector('#display-message-section').append(p);
      })

    document.querySelector('#send_message').onclick = () => {
    socket.send({'message': document.querySelector('#user_message').value, 'username': username, 'room': room});
    document.querySelector('#user_message').value = '';
    }

    document.querySelectorAll('.select-room').forEach(button => {
        button.onclick = () => {
            var newRoom = button.innerHTML;
            if (newRoom == room) {
                printSysMsg('You are already in the ' + room + ' room.');
            }
            else {
                leaveRoom(room);
                socket.emit('room-change', {'room': newRoom})
                setTimeout(function() {
                    location.reload();
                    }, 50);
            }
        }
    })

     socket.on('room-manager', data => {
        printSysMsg(data['message']);
     })

    function joinRoom(room) {
        socket.emit('join', {'username': username, 'room': room})
    }

    function leaveRoom(room) {
        socket.emit('leave', {'username': username,'room': room})
    }

   function printSysMsg(message) {
        var p = document.createElement('p');
        p.setAttribute("class", "system-msg");
        p.innerHTML = '<i><b>' + message + '</b></i>';
        document.querySelector('#display-message-section').append(p);
   }
})

function deleteRoom(room) {
    var wantToDelete = confirm('Are you sure you want to delete this room?');
    if(wantToDelete) {
        var xhr = new XMLHttpRequest();
        sender = JSON.stringify({'room': room});
        xhr.open('POST', '/delete-room');
        xhr.send(sender);
        window.location.reload();
  }
}

function clearRoom(room) {
    var wantToClear = confirm('Are you sure you want to clear the chat of this room?');
    if(wantToClear) {
        var xhr = new XMLHttpRequest();
        sender = JSON.stringify({'room': room});
        xhr.open('POST', '/clear-room');
        xhr.send(sender);
        window.location.reload();
    }
}
