//const Discord = require('discord.js');
//const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Gửi tin nhắn riêng tư đến 1 thành viên')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('Vui lòng sử dụng ID thành viên cần gửi tin nhắn')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('message')
                .setDescription('Nhập tin nhắn bạn muốn gửi vào phần này')
                .setRequired(true)),
    async execute (client, interaction) {
        if(interaction.user.id !== ownerId) return interaction.reply({ content: 'Woah, đây là lệnh đặc quyền và bạn không thể sử dụng nó!', ephemeral: true })

        const user = interaction.options.getString('user_id')
        //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id) || interaction.client.users.cache.get(user.id)
        const member = await interaction.client.users.fetch(user) || await interaction.client.users.cache.get(user);
        const message = interaction.options.getString('message');

        if(!member) return interaction.reply({ content: 'Thành viên bạn đề cập không có trong server hoặc không thể đọc được dữ liệu từ thành viên đó.', ephemeral: true })

        try {
            await member.send(message)
            await interaction.reply({ content: `Tin nhắn đã được gửi đến ${member.tag}`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: 'Thành viên hiện đã đóng DM hoặc ID được cung cấp có thể sai .-.', ephemeral: true });
            console.log("Đã xảy ra lỗi => ", err);
        }
    }
}