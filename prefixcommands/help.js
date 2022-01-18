const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Hiển thị tất cả các lệnh',
    async execute (client, message) {
        message.channel.sendTyping();
        const helpEmbed = new MessageEmbed()

        client.prefixcommands.forEach(command => {
            helpEmbed.addFields({ name: `${command.name}`, value: `${command.description}\nViết tắt: ${command.aliases || 'Không có'}`, inline: false })
        });

        return message.reply({ embeds: [helpEmbed] });
    }
}