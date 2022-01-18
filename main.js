//const Discord = require('discord.js');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, mongo_uri } = require('./config.json');
const prefix = require('./models/prefix');
const mongoose = require('mongoose');
//const { MessageEmbed, ContextMenuInteraction, MessageActionRow, MessageButton } = require("discord.js");
const { DiscordTogether } = require('discord-together');
const blacklist = require('./models/blacklist');
const DisTube = require('distube');
const { SoundCloudPlugin } = require("@distube/soundcloud");

mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true})

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] }, { partials: ["MESSAGE", "CHANNEL", "REACTION", "USER" ]});
//module.exports = client;
client.discordTogether = new DiscordTogether(client);
client.distube = new DisTube.default(client, {
	searchSongs: 0,
	searchCooldown: 30,
	emitNewSongOnly: true,
	leaveOnEmpty: true,
	emptyCooldown: 60,
	leaveOnFinish: true,
	leaveOnStop: true,
	updateYouTubeDL: false,
	plugins: [new SoundCloudPlugin()],
	// plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

for(const filez of fs.readdirSync('./distube_event/')) {
	if (filez.endsWith('.js')) {
		let fileName = filez.substring(0, filez.length - 3)
		let fileContents = require(`./distube_event/${filez}`)
		client.distube.on(fileName, fileContents.bind(null, client))
	}
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./slashcommands/${file}`);
	client.commands.set(command.data.name, command);
}

//Slash Commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	//if (!interaction.isButton()) return;
	//if (!interaction.isAutocomplete()) return;
	const user = interaction.user;
    //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
	const member = interaction.client.users.cache.get(user.id)

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	blacklist.findOne({ id : member }, async(err, data) => {
		if (err) throw err;
		if (!data) {
			try {
				await command.execute(client, interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Đã xảy ra lỗi khi thực thi lệnh slash!', ephemeral: true });
			}
		} else if (data) {
			interaction.reply({ content: 'Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.'});
		}
	});
});

//client.contextmenucommands = new Collection();
const contextmenucommandFiles = fs.readdirSync('./contextmenu').filter(cfile => cfile.endsWith('.js'));

for (const cfile of contextmenucommandFiles) {
	const ccommand = require(`./contextmenu/${cfile}`);
	client.commands.set(ccommand.name, ccommand);
}

//Context Menu
client.on('interactionCreate', async interaction => {
	if (!interaction.isContextMenu()) return;
	const user = interaction.user;
    //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
	const member = interaction.client.users.cache.get(user.id)
	//console.log(member)

	const ccommand = client.commands.get(interaction.commandName);

	if (!ccommand) return;
	blacklist.findOne({ id : member }, async(err, data) => {
		if (err) throw err;
		if (!data) {
			try {
				await ccommand.execute(client, interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Đã xảy ra lỗi khi thực thi lệnh slash!', ephemeral: true });
			}
		} else if (data) {
			interaction.reply({ content: 'Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.'});
		}
	});
});

client.prefixcommands = new Collection();
const prefixcommandFiles = fs.readdirSync('./prefixcommands').filter(files => files.endsWith('.js'));

for (const files of prefixcommandFiles) {
	const commmand = require(`./prefixcommands/${files}`);
	client.prefixcommands.set(commmand.name, commmand);
}

//Prefix Commands
client.on('messageCreate', async (message) => {
	//if(!message.content.startsWith(prefix) || message.author.bot) return;
	const prefixData = await prefix.findOne({
		GuildID: message.guild.id
	});

	if (prefixData) {
		const command_prefix = prefixData.Prefix;

		if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(command_prefix)) return;
		const [cmd, ...args] = message.content.slice(command_prefix.length).trim().split(" ");
	
		const member = message.author.id;
		let idmember = `<@${member}>`;
		//console.log(idmember);		
		const commmand = client.prefixcommands.get(cmd.toLowerCase()) || client.prefixcommands.find(c => c.aliases?.includes(cmd.toLowerCase()));
		if (!commmand) return;
		blacklist.findOne({ id : idmember }, async(err, data) => {
			if (err) throw err;
			if (!data) {
				try {
					await commmand.execute(client, message, args);
				} catch (error) {
					console.error(error);
					await message.reply('Đã xảy ra lỗi khi thực thi lệnh!');
				}		
			} else if (data) {
				message.reply(`Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.`);
			}
		})
	} else if (!prefixData) {
		const command_prefix = "_";

		let newData = new prefix({
			Prefix: command_prefix,
			GuildID: message.guild.id
		})
		newData.save();

		if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(command_prefix)) return;
		const [cmd, ...args] = message.content.slice(command_prefix.length).trim().split(" ");
	
		const member = message.author.id;
		let idmember = `<@${member}>`;
		//console.log(idmember);		
		const commmand = client.prefixcommands.get(cmd.toLowerCase()) || client.prefixcommands.find(c => c.aliases?.includes(cmd.toLowerCase()));
		if (!commmand) return;
		blacklist.findOne({ id : idmember }, async(err, data) => {
			if (err) throw err;
			if (!data) {
				try {
					await commmand.execute(client, message, args);
				} catch (error) {
					console.error(error);
					await message.reply('Đã xảy ra lỗi khi thực thi lệnh!');
				}		
			} else if (data) {
				message.reply(`Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.`);
			}
		})
	}
	// if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;
	// const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");

	// const member = message.author.id;
	// let idmember = `<@${member}>`;
	// //console.log(idmember);		
	// const commmand = client.prefixcommands.get(cmd.toLowerCase()) || client.prefixcommands.find(c => c.aliases?.includes(cmd.toLowerCase()));
	// if (!commmand) return;
	// blacklist.findOne({ id : idmember }, async(err, data) => {
	// 	if (err) throw err;
	// 	if (!data) {
	// 		try {
	// 			await commmand.execute(client, message, args);
	// 		} catch (error) {
	// 			console.error(error);
	// 			await message.channel.reply('Đã xảy ra lỗi khi thực thi lệnh!');
	// 		}		
	// 	} else if (data) {
	// 		message.reply(`Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.`);
	// 	}
	// })
});

client.login(token);