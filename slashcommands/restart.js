//const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Khởi động lại bot'),
    async execute (client, interaction) {
        if (interaction.user.id !== ownerId) return interaction.reply({ content: 'Uhhh oh... Chỉ chủ sở hữu bot mới được phép xài lệnh này .-.' });

        await interaction.reply({ content: `Đang khởi động lại bot...`, ephemeral: true });
        return process.exit();
    }
}