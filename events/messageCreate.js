const { prefix } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;
		console.log(`${message.author.tag} in #${message.channel.name} triggered a command.`);
	},
};