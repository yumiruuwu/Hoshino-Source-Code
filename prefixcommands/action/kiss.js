const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'kiss',
    description: 'Hôn ai đó <3',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/kiss';

        if (!member) return message.reply({ content: 'Bạn phải tag người mà bạn muốn ||môi chạm môi|| với họ vào <:kkk:895615255223357441>' })
        if (member.id === message.author.id) return message.reply({ content: '<:keqing_speechless:933324402941112351>' });
        if (member.id === clientId) return message.reply({ content: '<:keqing_no:933324798715641926>' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Xin lỗi vì đã làm gián đoạn tình cảm của 2 người nhưng API của mình die rồi <:catok:933309520493576242>\nMình cần API để hoạt động nên vui lòng thử lại lúc khác nhé!`)
        }

        let randomTitle = [
            `${message.author.username} đã hôn ${member.username}`,
            `${member.username} được hôn bởi ${message.author.username}`,
            `${message.author.username} đã trao nụ hôn của họ cho ${member.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const kissEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        return message.reply({ embeds: [kissEmbed] });
    }
}