export default class Socket {
	#serverConnection = {};

	constructor({ port, host, protocol }) {
		this.port = port;
		this.host = host;
		this.protocol = protocol;
	}

	async createConnection() {
		const options = {
			port: this.port,
			host: this.host,
			headers: {
				Connection: 'upgrade',
				Upgrade: 'websocket',
			},
		};

		const http = await import(this.protocol);
		const req = http.request(options);
		req.end();
		return new Promise((resolve) => {
			req.once('upgrade', (res, socket) => {
				resolve(socket);
			});
		});
	}

	async initialize() {
		this.#serverConnection = await this.createConnection();
		console.log('Connected to the server!!');
	}
}
