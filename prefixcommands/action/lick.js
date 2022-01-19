const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'lick',
    description: 'mlem ai đó :3',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://purrbot.site/api/img/sfw/lick/gif';

        if (!member) return message.reply({ content: 'mlem? Who?' });
        if (member.id === message.author.id) return message.reply({ content: 'Hành động của bạn trông như con mồn lèo ấy :>' });
        if (member.id === clientId) return;

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`API đã die, 2 bạn có thể liếm màn hình thay vào đó <:catok:933309520493576242>`)
        }

        let randomTitle = [
            `${message.author.username} đã liếm ${member.username} ||Eww||`,
            `${member.username} đã bị mlem bởi ${message.author.username}`,
            `${message.author.username} đang lewd với ${member.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const lickEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.link)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        return message.reply({ embeds: [lickEmbed] });
    }
}