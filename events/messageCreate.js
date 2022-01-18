const prefixModel = require('../models/prefix');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const data = await prefixModel.findOne({
			GuildID: message.guild.id
		});

		const prefix = data.Prefix;

		if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;
		console.log(`${message.author.tag} in #${message.channel.name} triggered a command.`);
	},
};