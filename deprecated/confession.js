const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confession')
        .setDescription('Chia sẻ tâm tình với mọi người'),
    async execute (client, interaction) {
        const confessionModal = new Modal()
        .setTitle('[BETA] Confession')
        .setCustomId('confession')

        const authorInput = new TextInputComponent()
        .setLabel('Tên của bạn')
        .setRequired(false)
        .setCustomId('author')
        .setStyle('SHORT')
        .setPlaceholder('VD: Sir Devil#7711')

        const messageInput = new TextInputComponent()
        .setLabel('Nội dung')
        .setRequired(true)
        .setCustomId('message')
        .setStyle('PARAGRAPH')
        .setPlaceholder('Cần tuyển người yêu :v')

        const firstRow = new MessageActionRow()
        .addComponents(authorInput)

        const secondRow = new MessageActionRow()
        .addComponents(messageInput)

        confessionModal.addComponents(firstRow, secondRow);

        await interaction.showModal(confessionModal);

        const filter = (interaction) => interaction.customId === 'confession';

        interaction.awaitModalSubmit({ filter, time: 150_000 }).then(async (modal) => {
            const author = modal.fields.getTextInputValue('author') || '1 bạn giấu tên';
            const message = modal.fields.getTextInputValue('message');

            await modal.reply({ content: 'Đã nhận được đơn của bạn :D', ephemeral: true });

            const confessionEmbed = new MessageEmbed()
            .setDescription(`${message}`)
            .setColor('RANDOM')
            .setFooter({ text: `Được viết bởi ${author}` })

            await interaction.channel.send({ embeds: [confessionEmbed] });
        });
    }
}