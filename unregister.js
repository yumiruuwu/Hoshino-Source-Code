const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');
//const { Client, Collection, Intents } = require('discord.js');
//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS] }, { partials: ["MESSAGE", "CHANNEL", "REACTION" ]});

const guild = process.argv[2];

const commands = [];
const commandFiles = fs.readdirSync('./empty').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./empty/${file}`);
	commands.push(command.data.toJSON());
}

//const contextmenucommands = [];
const contextmenucommandFiles = fs.readdirSync('./empty').filter(cfile => cfile.endsWith('.js'));

for (const cfile of contextmenucommandFiles) {
	const ccommand = require(`./empty/${cfile}`);
	commands.push(ccommand);
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Bắt đầu tiến hành load lệnh Slash và Context Menu!');

		await rest.put(
            guild
                ? Routes.applicationGuildCommands(clientId, guild)
                : Routes.applicationCommands(clientId),
			{
                body: commands,
            }
		);

		console.log('Đã rút xong các lệnh Slash và Context Menu khỏi server!');
	} catch (error) {
		console.error(error);
	}
})();