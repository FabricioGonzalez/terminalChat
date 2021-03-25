import Events from 'events';
import { constants } from './constants.js';
import Controller from './controller.js';
import SocketServer from './socket.js';

const port = process.env.PORT || 9898;

const eventEmmiter = new Events();

async function testServer() {
	const options = {
		port: 9898,
		host: 'localhost',
		headers: {
			Connection: 'upgrade',
			Upgrade: 'websocket',
		},
	};
	const http = await import('http');
	const req = http.request(options);
	req.end();
	req.on('upgrade', (res, socket) => {
		socket.on('data', (data) => {
			console.log('client recieved', data.toString());
		});
		setInterval(() => {
			socket.write('Hello!');
		}, 500);
	});
}

const socketServer = new SocketServer({ port });

const server = await socketServer.initialize(eventEmmiter);

console.log('socket server is running at', server.address().port);

const controller = new Controller({ socketServer });

eventEmmiter.on(
	constants.event.NEW_USER_CONNECTED,
	controller.onNewConnection.bind(controller),
);
