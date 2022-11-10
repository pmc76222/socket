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
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`)
    });   
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);     
        done();   
        socket.to(roomName).emit('welcome');     
    });   
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);