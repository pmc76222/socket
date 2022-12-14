import http from "http";
import express from "express";
import  {Server}  from "socket.io";

const app = express();

app.set('view engine', 'pug');
app.set('views',__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on('connection', (socket) => { 
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`)
    });   
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);     
        done();   
        socket.to(roomName).emit('welcome',socket.nickname);     
    });   
    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => socket.to(room).emit('bye',socket.nickname));
    });
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done();
    })
    socket.on('nickname', (nickname) => socket["nickname"] = nickname)

});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);