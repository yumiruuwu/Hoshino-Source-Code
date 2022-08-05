const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Gửi tin nhắn bằng bot')
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('Tài liệu cần gửi (nếu có)')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({ content: 'Mình không có quyền thực hiện điều này ;-;\nHãy bổ sung cho mình quyền SEND_MESSAGES để mình có thể thực hiện theo yêu cầu của bạn.', ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.ViewChannel)) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền VIEW_CHANNEL ở kênh này cho mình nhé ;-;', ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền SEND_MESSAGE ở kênh này cho mình nhé ;-;', ephemeral: true });
        
        const attachment_included = interaction.options.getAttachment('attachment');
        
        const sendModal = new ModalBuilder()
        .setTitle('Gửi tin nhắn bằng bot')
        .setCustomId('send')

        const messageInput = new TextInputBuilder()
        .setLabel('Nội dung tin nhắn cần gửi')
        .setRequired(true)
        .setCustomId('messageinput')
        .setPlaceholder('UwU')
        .setStyle(TextInputStyle.Paragraph)

        const firstRow = new ActionRowBuilder()
        .addComponents(messageInput)

        sendModal.addComponents(firstRow);

        await interaction.showModal(sendModal);

        try {
            const filter = (interaction) => interaction.customId === 'send';

            interaction.awaitModalSubmit({ filter, time: 150_000 }).then(async (modal) => {
                const message = modal.fields.getTextInputValue('messageinput');
    
                await modal.reply({ content: 'Đã nhận được yêu cầu của bạn :D', ephemeral: true });

                if (attachment_included) {
                    await interaction.channel.send({ content: `${message}`, files: [attachment_included] }); //Require first time run without attachment
                    return;
                } else if (!attachment_included) {
                    await interaction.channel.send({ content: `${message}` });
                    return;
                }
            });
        } catch (err) {
            await interaction.reply({ content: 'Woops, mình không có quyền gửi tin nhắn tại đây .-.\nHãy bổ sung quyền **SEND_MESSAGE** cho mình để tiến hành lệnh hiệu quả hơn.', ephemeral: true });
            //console.log("Đã xảy ra lỗi => ", err);
        }
    }
}