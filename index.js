const config = require('./config.json');
const mineflayer = require('mineflayer');
const discord = require('discord.js');

const client = new discord.Client();

const bot = mineflayer.createBot({
	host: config.server.ip,
	port: config.server.port,
	username: config.user.email,
	password: config.user.password,
	version: config.server.version,
});

let channel = config.channel;

bot.on('login', () => {
	console.log(`Logged in as ${bot.username}`);
	if (config.server.onLogin) {
		bot.chat(config.server.onLogin);
	}
});

// bot.on('chat', (username, message) => {
// if (username === bot.username) return;
// if (!channel) return;
// console.log(username.toString() + ' >> ' + message.toString());
// channel.send(`\`\`\`${username.toString()} >> ${message.toString()}\`\`\``);
// });

bot.on('kicked', (reason, loggedIn) => {
	console.log(`${loggedIn} >>> ${reason}`);
});

bot.on('message', (message) => {
	if (message.toString().includes(bot.username)) return;
	if (!channel) return;
	console.log(message.toString());
	channel
		.send(message.toString())
		.catch((e) => console.log('[IGNORE] Cannot send empty messages '));
});

client.on('ready', () => {
	console.log(`The discord bot logged in! Username: ${client.user.username}!`);
	channel = client.channels.cache.find((x) => x.id === channel);
	if (!channel) {
		console.log('Channel not found');
		process.exit(1);
	}
});

client.on('message', (message) => {
	if (message.author.bot || message.channel.id !== channel.id) return;
	bot.chat(message.content);
});

client.login(config.token);
