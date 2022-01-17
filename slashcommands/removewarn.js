const db = require('../models/warns');
//const { Message, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Xoá cảnh cáo cho thành viên')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần xoá')
                .setRequired(true))
        .addIntegerOption(option2 =>
            option2.setName('listnumber')
                .setDescription('Cần xoá cảnh cáo số mấy!')
                .setRequired(true)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        const listnumber = interaction.options.getInteger('listnumber')

        if(!member) return interaction.reply({ content: 'Thành viên được đề cập không hợp lệ .-.', ephemeral: true })

        db.findOne({ guildid : interaction.guild.id, user: member.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                let number = parseInt(listnumber) - 1
                data.content.splice(number, 1)
                interaction.reply('Đã xoá cảnh cáo gần đây của thành viên!')
                data.save()
            } else {
                interaction.reply('Thành viên được đề cập không có cảnh cáo nào trong dữ liệu máy chủ!')
            }
        })
    }
}