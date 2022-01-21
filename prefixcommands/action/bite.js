const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'bite',
    description: 'Cắn ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://purrbot.site/api/img/sfw/bite/gif';

        if (!member) return message.reply({ content: 'Bạn định cắn ai thế <:EH_miru_huh:933553804270530590>' });
        if (member.id === message.author.id) return message.reply({ content: 'Khoan?! Bạn không thể tự cắn mình được <:EH_oh:864786939593228289>' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Đã xảy ra lỗi khi tiến hành cắn người :3`)
        }

        let randomTitle = [
            `${message.author.username} đã nhảy ra cắn ${member.username}`,
            `${member.username} đã bị cắn bởi ${message.author.username}`
        ];

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const biteEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.link)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        if (member.id === clientId) biteEmbed.setDescription(`ulatr`)

        return message.reply({ embeds: [biteEmbed] });
    }
}