const db = require('../models/warns');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Cảnh cáo thành viên')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần cảnh cáo')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('reason')
                .setDescription('Lý do cảnh cáo')
                .setRequired(true)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id)
        const reason = interaction.options.getString('reason')

        if(!member) return interaction.reply({ content: 'Thành viên được đề cập không hợp lệ .-.', ephemeral: true })

        db.findOne({ guildid: interaction.guild.id, user: member.user.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    guildid: interaction.guild.id,
                    user : member.user.id,
                    content : [
                        {
                            moderator : interaction.user.id,
                            reason : reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: interaction.user.id,
                    reason : reason
                }
                data.content.push(obj)
            }
            data.save()
        });

        const userEmbed = new MessageEmbed()
        .setDescription(`Bạn đã bị cảnh cáo với lý do **${reason}**`)
        .setColor('RED')

        const warnEmbed = new MessageEmbed()
        .setDescription(`Đã cảnh cáo thành viên ${user} với lý do **${reason}**`)
        .setColor('BLUE')
        
        member.send({ embeds: [userEmbed] })
        interaction.reply({ embeds: [warnEmbed] })
    }
}