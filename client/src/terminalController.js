import ComponentsBuilder from './components.js';
import { constants } from './constants.js';

export default class TerminalController {
	#usersColor = new Map();

	constructor() {}

	#pickColor() {
		return `#` + (((1 << 24) * Math.random()) | 0).toString(16) + '-fg';
	}

	#getUsersColor(userName) {
		if (this.#usersColor.has(userName)) {
			return this.#usersColor.get(userName);
		}

		const color = this.#pickColor();

		this.#usersColor.set(userName, color);

		return color;
	}

	#registerEvents(eventEmmiter, components) {
		eventEmmiter.on(
			constants.app.MESSAGE_RECIEVED,
			this.#onMessageRecieved(components),
		);
		/* 		eventEmmiter.on(
			constants.app.MESSAGE_SENT,
			this.#onMessageSent(components),
		); */
		eventEmmiter.on(
			constants.app.ACTIVITYLOG_UPDATED,
			this.#onLogChanged(components),
		);
		eventEmmiter.on(
			constants.app.STATUS_UPDATED,
			this.#onStatusChanged(components),
		);
	}

	#onMessageRecieved({ screen, chat }) {
		return (msg) => {
			const { userName, message } = msg;
			const color = this.#getUsersColor(userName);

			chat.addItem(`{${color}}{bold}${userName}{/}:${message}`);
			screen.render();
		};
	}

	#onLogChanged({ screen, activityLog }) {
		return (msg) => {
			const [userName] = msg.split(/\s/);
			const color = this.#getUsersColor(userName);
			activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}`);

			screen.render();
		};
	}

	#onStatusChanged({ screen, status }) {
		return (users) => {
			const { content } = status.items.shift();

			status.clearItems();
			status.addItem(content);

			users.forEach((userName) => {
				const color = this.#getUsersColor(userName);
				status.addItem(`{${color}}{bold}${userName}{/}`);
			});

			screen.render();
		};
	}

	#onInputRecieved(eventEmmiter) {
		return function () {
			const msg = this.getValue();
			console.log(msg);
			this.clearValue();
		};
	}

	initializeTable(eventEmmiter) {
		const components = new ComponentsBuilder()
			.setScreen({ title: 'chat -0 Fabricio Gonzalez' })
			.setLayoutComponent()
			.setInputComponent(this.#onInputRecieved(eventEmmiter))
			.setChatComponent()
			.setActivityLogComponent()
			.setStatusComponent()
			.build();

		this.#registerEvents(eventEmmiter, components);

		components.input.focus();
		components.screen.render();
	}
}
