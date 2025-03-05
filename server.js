const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mineflayer = require('mineflayer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const bot = mineflayer.createBot({
    host: "mc.cheatmine.ru",
    port: "25565",
    version: "1.19.4",
    username: "halfybot"
});

bot.once('spawn', function () {
    bot.chat('/reg password password');
    bot.chat('/l password');
    bot.chat('/roleplay');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Клиент подключен');

    socket.on('chatMessage', (message) => {
        bot.chat(message);
    });

    bot.on('message', (message) => {
        const formattedMessage = `${message.toAnsi()}`;
        socket.emit('chatMessage', formattedMessage);
    });

    socket.on('requestPlayers', () => {
        const players = Object.keys(bot.players);
        socket.emit('playerList', players);
    });

    setInterval(() => {
        const players = Object.keys(bot.players);
        socket.emit('playerList', players);
    }, 5000); // Автообновление списка игроков каждые 5 секунд
});

bot.on('spawn', () => {
    console.log('Бот подключился к серверу!');
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
