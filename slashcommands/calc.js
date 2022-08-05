const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const math = require('mathjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Giải toán')
        .addStringOption(option => 
            option.setName('input')
                .setDescription('Vui lòng nhập câu hỏi. Các ký tự cho phép bao gồm các con số và ký hiệu toán học cơ bản.')
                .setRequired(true)),
	async execute(client, interaction) {
		try {
            const questions = interaction.options.getString('input');
            const answer = await math.evaluate(questions);

			const quickMathsEmbed = new EmbedBuilder()
			.setTitle('Bài giải')
			.setColor('Green')
			.addFields(
				{name: 'Câu hỏi:', value: `\`${questions}\``},
				{name: 'Trả lời:', value: `\`${answer}\``}
			)
			.setTimestamp()

			await interaction.reply({ embeds: [quickMathsEmbed] });
		} catch (err) {
            interaction.reply({ content: 'Woops!! Câu hỏi của bạn không khả dụng.', ephemeral: true });
			//console.log("Đã xảy ra lỗi => ", err);
		}
	},
};