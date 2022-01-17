//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Dùng để gỡ lệnh cấm ai đó vào nhà!')
        .addUserOption(option => 
            option.setName('userid')
                .setDescription('ID thành viên đã bị ban')
                .setRequired(true))
        .addStringOption(option2 => 
            option2.setName('reason')
                .setDescription('Lý do gỡ lệnh cấm!')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('userid')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => console.log(err))

        const reason = interaction.options.getString('reason') || 'Không có';

        const embed = new MessageEmbed()
        //.setFooter("UNBAN_MEMBER")
        .setFooter({ text: 'UNBAN_MEMBER' })

        interaction.guild.bans.fetch().then( bans => {

            const users = bans.find(ban => ban.user.id === user.id );

            if (users) {
                embed.setTitle(`Đã gỡ lệnh cấm cho thành viên ${users.user.tag}`)
                    .setColor('#00ff00')
                    .addField('ID người dùng', users.user.id, true)
                    .addField('Tag người dùng', users.user.tag, true)
                    .addField('Lý do bị cấm', users.reason != null ? users.reason : 'Không có')
                    .addField('Lý do được gỡ lệnh cấm', reason)
                    .setTimestamp()
                interaction.guild.members.unban(users.user.id, reason).then(() => interaction.reply({ embeds: [embed] }))
            } else {
                embed.setTitle(`Người dùng ${member.tag} chưa bị cấm!`)
                    .setColor('#797676')
                interaction.reply(embed)
            }
        }).catch(e => {
            console.log(e)
            interaction.reply('Lỗi khi tiến hành!')
        });
    }
};