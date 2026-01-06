import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameEngine } from './game/GameEngine';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;


const game = new GameEngine(io);
game.start();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    game.addPlayer(socket);

    socket.on('input', (data) => {
        game.handleInput(socket.id, data);
    });

    socket.on('duel-input', (word) => {
        game.handleDuelInput(socket.id, word);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        game.removePlayer(socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
