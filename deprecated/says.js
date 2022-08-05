const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('says')
        .setDescription('Gửi tin nhắn bằng bot nhưng kết hợp với modal'),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('VIEW_CHANNEL')) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền VIEW_CHANNEL cho mình nhé ;-;', ephemeral: true });
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('SEND_MESSAGES')) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền SEND_MESSAGE cho mình nhé ;-;', ephemeral: true });
        const sendModal = new Modal()
        .setTitle('Gửi tin nhắn bằng bot')
        .setCustomId('send')

        const messageInput = new TextInputComponent()
        .setLabel('Nội dung tin nhắn cần gửi')
        .setRequired(true)
        .setCustomId('messageinput')
        .setPlaceholder('UwU')
        .setStyle('PARAGRAPH')

        const firstRow = new MessageActionRow()
        .addComponents(messageInput)

        sendModal.addComponents(firstRow);

        await interaction.showModal(sendModal);

        try {
            const filter = (interaction) => interaction.customId === 'send';

            interaction.awaitModalSubmit({ filter, time: 150_000 }).then(async (modal) => {
                const message = modal.fields.getTextInputValue('messageinput');
    
                await modal.reply({ content: 'Đã nhận được yêu cầu của bạn :D', ephemeral: true });
    
                await interaction.channel.send({ content: `${message}` });
            });
        } catch (err) {
            await interaction.reply({ content: 'Woops, mình không có quyền gửi tin nhắn tại đây .-.\nHãy bổ sung quyền **SEND_MESSAGE** cho mình để tiến hành lệnh hiệu quả hơn.', ephemeral: true });
            //console.log("Đã xảy ra lỗi => ", err);
        }
    }
}