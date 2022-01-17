const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription('Xem lịch sử thay đổi của bot'),
	async execute(client, interaction) {
		try {
			const changelogembed = new MessageEmbed()
			.setTitle('Changelog')
			.setColor('RANDOM')
			.setDescription(`Contributor: [M.Y](https://discord.com/users/497010169704742912), [Miru.](https://discord.com/users/531300476969287699), replicanya, Callio`)
			.addField('Phiên bản hiện tại:', `[2.1.4](https://bit.ly/3rkRe26)`)
			.addField('1 số lỗi bot đang gặp phải ;-;', `[Xem lỗi](https://bit.ly/3m8bJgK)`)
			.setFooter({ text: 'XIII' })
			.setTimestamp()

			return interaction.reply({ embeds: [changelogembed], ephemeral: true });
		} catch (err) {
			console.log("Đã xảy ra lỗi => ", err);
		}
	},
};