const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
//const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reply-message')
        .setDescription('[BETA] Cho bot reply 1 tin nhắn với ID được chỉ định')
        .addStringOption(option => 
            option.setName('message_id')
                .setDescription('ID tin nhắn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Nội dung trả lời')
                .setRequired(true)),
    async execute (client, interaction) {
        //if (interaction.user.id !== ownerId) return interaction.reply({ content: 'Uhhh oh... Chỉ chủ sở hữu bot mới được phép xài lệnh này .-.' });
        if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.ViewChannel)) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền VIEW_CHANNEL cho mình nhé ;-;', ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền SEND_MESSAGE cho mình nhé ;-;', ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply({ content: 'Hình như nội dung tin nhắn có sử dụng custom emoji và em không có quyền được phép sử dụng emoji từ server khác .-.', ephemeral: true });
        const mid = interaction.options.getString('message_id');
        const mcontent = interaction.options.getString('message');
        const currentchannel = interaction.channel;

        if(isNaN(mid)) return interaction.reply({ content: "Mình nhớ là ID tin nhắn chỉ bao gồm những con số thôi mà nhỉ .-.", ephemeral: true });

        try {
            interaction.client.channels.fetch(currentchannel.id).then(cchannel => {
                cchannel.messages.fetch(mid).then(message => {
                    message.reply(mcontent);
                });
            });

            return interaction.reply({ content: 'Đã reply <:fusa:899916859489550396>:thumbsup:', ephemeral: true });
        } catch (err) {
            interaction.reply({ content: 'Hãy chắc chắn rằng chủ nhân đã nhập đúng ID của tin nhắn và trong nội dung tin nhắn không nên bao gồm các emoji từ các server mà mình không có mặt .-.', ephemeral: true });
        }
    }
}