//const Discord = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Dùng để gỡ lệnh cấm ai đó vào nhà!')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('ID thành viên đã bị cấm')
                .setRequired(true))
        .addStringOption(option2 => 
            option2.setName('reason')
                .setDescription('Lý do gỡ lệnh cấm!')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: 'Mình không có quyền thực hiện điều này ;-;\nHãy bổ sung cho mình quyền BAN_MEMBERS để mình có thể thực hiện theo yêu cầu của bạn.', ephemeral: true });

        const user = interaction.options.getString('user_id');
        const member = await interaction.client.users.fetch(user);
        //console.log(member);

        if (isNaN(user)) return interaction.reply({ content: "ID của người bị cấm chỉ bao gồm các con số thôi mà nhỉ .-.", ephemeral: true });

        const reason = interaction.options.getString('reason') || 'Không có';

        const embed = new EmbedBuilder()
        .setFooter({ text: 'UNBAN_MEMBER' })

        await interaction.guild.bans.fetch().then( bans => {

            const users = bans.find(ban => ban.user.id === member.id );

            if (users) {
                embed.setTitle(`Đã gỡ lệnh cấm cho thành viên ${users.user.tag}`)
                    .setColor('#00ff00')
                    .addFields(
                        { name: 'ID người dùng', value: `${users.user.id}`, inline: true },
                        { name: 'Tag người dùng', value: `${users.user.tag}`, inline: true },
                        { name: 'Lý do bị cấm', value: `${users.reason != null ? users.reason : 'Không có'}`},
                        { name: 'Lý do được gỡ lệnh cấm', value: `${reason}`}
                    )
                    // .addField('ID người dùng', users.user.id, true)
                    // .addField('Tag người dùng', users.user.tag, true)
                    // .addField('Lý do bị cấm', users.reason != null ? users.reason : 'Không có')
                    // .addField('Lý do được gỡ lệnh cấm', reason)
                    .setTimestamp()
                interaction.guild.members.unban(users.user.id, reason).then(() => interaction.reply({ embeds: [embed] }))
            } else if (!users) {
                embed.setTitle(`Người dùng ${member.tag} chưa bị cấm!`)
                    .setColor('#797676')
                interaction.reply({ embeds: [embed] })
            }
        }).catch(e => {
            console.log(e)
            interaction.reply('Lỗi khi tiến hành!')
        });
    }
};