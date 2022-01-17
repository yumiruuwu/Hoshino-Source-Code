//const Discord = require('discord.js');
//const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Khác với send thì slash này không cần đề cập kênh cần gửi.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Nhập tin nhắn mà bạn muốn gửi vào phần này!')
                .setRequired(true)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('VIEW_CHANNEL')) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền VIEW_CHANNEL cho mình nhé ;-;', ephemeral: true });
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('SEND_MESSAGES')) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền SEND_MESSAGE cho mình nhé ;-;', ephemeral: true });
        const message = interaction.options.getString('message')
        const channel = interaction.channel;

        try {
            channel.sendTyping()
            await channel.send(message)
            await interaction.reply({ content: `Tin nhắn đã được gửi!`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: 'Woops, mình không có quyền gửi tin nhắn tại đây .-.\nHãy bổ sung quyền **SEND_MESSAGE** cho mình để tiến hành lệnh hiệu quả hơn.', ephemeral: true });
            //console.log("Đã xảy ra lỗi => ", err);
        };
    }
}