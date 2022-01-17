//const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
//const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react-message')
        .setDescription('React emoji lên 1 tin nhắn nhất định')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ID tin nhắn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji dùng để react')
                .setRequired(true)),
    async execute (client, interaction) {
        //if (interaction.user.id !== ownerId) return interaction.reply({ content: 'Uhhh oh... Chỉ chủ sở hữu bot mới được phép xài lệnh này .-.' });
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('ADD_REACTIONS')) return interaction.reply({ content: 'Em không có đủ quyền để làm theo mệnh lệnh của chủ nhân, chủ nhân có thể bổ sung quyền ADD_REACTIONS cho em được không ;-;', ephemeral: true });
        if (!interaction.guild.me.permissionsIn(interaction.channel).has('USE_EXTERNAL_EMOJIS')) return interaction.reply({ content: 'Em không có đủ quyền để làm theo mệnh lệnh của chủ nhân, chủ nhân có thể bổ sung quyền USE_EXTERNAL_EMOJIS cho em được không ;-;', ephemeral: true });
        const mid = interaction.options.getString('message_id');
        const remoji = interaction.options.getString('emoji');
        const currentchannel = interaction.channel;

        if(isNaN(mid)) return interaction.reply({ content: "Mình nhớ là ID tin nhắn chỉ bao gồm những con số thôi mà nhỉ .-.", ephemeral: true });

        try {
            interaction.client.channels.fetch(currentchannel.id).then(cchannel => {
                cchannel.messages.fetch(mid).then(message => {
                    message.react(remoji);
                });
            });

            return interaction.reply({ content: 'Đã react <:fusa:899916859489550396>:thumbsup:', ephemeral: true });
        } catch (err) {
            interaction.reply({ content: 'Hãy chắc chắn rằng bạn đã nhập đúng ID của tin nhắn và emoji cần react .-.', ephemeral: true });
        }
    }
}