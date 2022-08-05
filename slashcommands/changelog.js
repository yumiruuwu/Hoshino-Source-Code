const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription('Xem lịch sử thay đổi của bot'),
	async execute(client, interaction) {
		try {
			const changelogembed = new EmbedBuilder()
			.setTitle('Changelog')
			.setColor('Random')
			.setDescription(`Contributor: [Mykm](https://discord.com/users/497010169704742912), [Miru.](https://discord.com/users/531300476969287699), replicanya, Callio`)
			.addFields(
				{name: 'Phiên bản hiện tại:', value: `[2.1.7](https://bit.ly/3peWWSV)`},
				{name: '1 số lỗi bot đang gặp phải ;-;', value: `[Xem lỗi](https://bit.ly/3m8bJgK)`}
			)
			.setFooter({ text: 'XIII' })
			.setTimestamp()

			return interaction.reply({ embeds: [changelogembed], ephemeral: true });
		} catch (err) {
			console.log("Đã xảy ra lỗi => ", err);
		}
	},
};