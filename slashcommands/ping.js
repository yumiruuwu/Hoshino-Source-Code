//const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
//const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Kiểm tra độ trễ của bot!'),
	async execute(client, interaction) {
		try {
			await interaction.deferReply();
			const mesg = await interaction.editReply({ content: "Pong!", fetchReply: true });

			const pingEmbed = new MessageEmbed()
			.setTitle('Ping pong :3')
			.setColor('RANDOM')
			.setDescription(`**__Độ trễ của bot:__** ${mesg.createdTimestamp - interaction.createdTimestamp}ms\n**__Độ trễ phản hồi từ server:__** ${client.ws.ping}ms`)
			.setTimestamp()
			// await interaction.editReply({ content: `Pong!\nĐộ trễ của bot: \`${mesg.createdTimestamp - interaction.createdTimestamp}ms\`, Độ trễ phản hồi từ server: \`${client.ws.ping}ms\`` });
			await interaction.editReply({ embeds: [pingEmbed] });
		} catch (err) {
			console.log("Đã xảy ra lỗi => ", err);
		}
	},
};