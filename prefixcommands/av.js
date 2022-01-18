//const { Message } = require("discord.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av', 'ava'],
    description: 'Xem avatar của thành viên',
    async execute (client, message) {
        const avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 1024 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 });
        if (message.mentions.users.size > 0) {
            const mentionedEmbed = new MessageEmbed()
            .setTitle(`Ảnh hồ sơ của thành viên ${message.mentions.users.first().username}`)
            .setColor('#FFC0CB')
            .setImage(`${avatar}`)
            //.setFooter(`${message.author.username}`)
            .setFooter({ text: `${message.author.username}` })
            .setTimestamp();

            message.reply({ embeds: [mentionedEmbed] });
        }else {
            const nomentionEmbed = new MessageEmbed()
            .setTitle(`Ảnh hồ sơ của thành viên ${message.author.username}`)
            .setColor('#FFC0CB')
            .setImage(`${avatar}`)
            //.setFooter(`${message.author.username}`)
            .setFooter({ text: `${message.author.username}` })
            .setTimestamp();

            message.reply({ embeds: [nomentionEmbed] });
        }
    }
}