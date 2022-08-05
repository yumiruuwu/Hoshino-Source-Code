const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token, mongo_uri } = require('./config.json');
const prefix = require('./models/prefix');
const mongoose = require('mongoose');
//const { DiscordTogether } = require('discord-together');
const blacklist = require('./models/blacklist');

mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true})

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
	ws: {
		properties: {
			$os: process ? process.platform : 'discord.js',
			$browser: 'Discord iOS',
		},
	},
});

//client.discordTogether = new DiscordTogether(client);

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
const slashcommandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));

for (const slash_file of slashcommandFiles) {
	const slash_command = require(`./slashcommands/${slash_file}`);
	client.commands.set(slash_command.data.name, slash_command);
}

//Slash Commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	//if (!interaction.isButton()) return;
	//if (!interaction.isAutocomplete()) return;
	const user = interaction.user;
    //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
	const member = interaction.client.users.cache.get(user.id)

	const slashcommand = client.commands.get(interaction.commandName);

	if (!slashcommand) return;
	blacklist.findOne({ id : member }, async(err, data) => {
		if (err) throw err;
		if (!data) {
			try {
				await slashcommand.execute(client, interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Đã xảy ra lỗi khi thực thi lệnh slash!', ephemeral: true });
			}
		} else if (data) { //lgtm [js/trivial-conditional]
			interaction.reply({ content: 'Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.'});
		}
	});
});

//client.contextmenucommands = new Collection();
const contextmenucommandFiles = fs.readdirSync('./contextmenu').filter(contextmenu_file => contextmenu_file.endsWith('.js'));

for (const contextmenu_file of contextmenucommandFiles) {
	const contextmenu_command = require(`./contextmenu/${contextmenu_file}`);
	client.commands.set(contextmenu_command.name, contextmenu_command);
}

//Context Menu
client.on('interactionCreate', async interaction => {
	if (!interaction.isContextMenuCommand()) return;
	const user = interaction.user;
    //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
	const member = interaction.client.users.cache.get(user.id)
	//console.log(member)

	const contextmenu_command = client.commands.get(interaction.commandName);

	if (!contextmenu_command) return;
	blacklist.findOne({ id : member }, async(err, data) => {
		if (err) throw err;
		if (!data) {
			try {
				await contextmenu_command.execute(client, interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Đã xảy ra lỗi khi thực thi lệnh slash!', ephemeral: true });
			}
		} else if (data) { //lgtm [js/trivial-conditional]
			interaction.reply({ content: 'Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.'});
		}
	});
});

client.prefixcommands = new Collection();
require("./handler")(client); //Since Prefix Commands require async & await so handler for prefix commands is required

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
			} else if (data) { //lgtm [js/trivial-conditional]
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
			} else if (data) { //lgtm [js/trivial-conditional]
				message.reply(`Etou... Có vẻ như bạn đã bị cấm sử dụng dịch vụ của mình. Nếu bạn nghĩ có sự sai sót gì ở đây thì hãy thông báo cho **Flandre.#9666** để được xem xét lại.`);
			}
		})
	}
});

client.login(token);