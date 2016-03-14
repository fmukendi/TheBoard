//updater/index.js
(function (updater) { //--> see updated data accross browsers ?
    
    var socketio = require("socket.io");

    updater.init = function (server){
        var io = socketio.listen(server);

        io.sockets.on("connection", function(socket){
            console.log("socket was connected");
            //socket.emit("showThis", "this is from the server");//---> dumb thing to do !!!
            
            socket.on("join category", function (category) {
                // when we join the category , we say this socket belongs to this room
                // and a socket can belong to more than one room 
                socket.join(category); //create rooms by on the category
            });

            socket.on("newNote", function (data) {
                //socket.broadcast.emit("broadcast note", data.note);// instead of broadcasting to everyone here, you should only(see below)
                // broadcast to the people only in that room 
                ///--> so that only the people on the history page will get history notes.
                socket.broadcast.to(data.category).emit("broadcast note", data.note);// broadcast to a single category
            });
        })
    };
})(module.exports);