const db = require('../models/warns');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkwarn')
        .setDescription('Xem danh sách số lần cảnh cáo của thành viên')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên để xem cảnh cáo')
                .setRequired(true)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id)

        if(!member) return interaction.reply({ content: 'Thành viên được đề cập không hợp lệ .-.', ephemeral: true })

        db.findOne({ guildid: interaction.guild.id, user: member.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                const warnclEmbed = new MessageEmbed()
                .setTitle(`Danh sách số lần cảnh cáo của ${user.username}`)
                .setColor('BLUE')

                data.content.map((w, i) => warnclEmbed.addFields({ name: `**${i + 1}** | Moderator : ${interaction.guild.members.cache.get(w.moderator).user.tag}`, value: `Lý do : ${w.reason}`}))
                
                interaction.reply({ embeds: [warnclEmbed] })
            } else {
                interaction.reply('Thành viên chưa bị cảnh cáo lần nào :O')
            }
        });
    }
}