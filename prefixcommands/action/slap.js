const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'slap',
    description: 'Vả/Tát ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/slap';

        if (!member) return message.reply({ content: '||Suỵt!! Bạn phải tag người cần vả thì mình mới có thể giúp bạn được||' });
        if (member.id === message.author.id) return message.reply({ content: 'Mình không cho phép bạn làm thế .-.' });
        if (member.id === clientId) return message.reply({ content: '<:jahy_ac:933351700612415588>' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Dịch vụ vả trực tuyến hiện không phản hồi, xin vui lòng thử lại lúc khác.`)
        }

        let randomTitle = [
            `${message.author.username} đã tát ${member.username}`,
            `${member.username} đã bị tát bởi ${message.author.username}`,
            `BỐP!! ${member.username} đã trọn vẹn 1 vả của ${message.author.username}`,
            `${message.author.username} đã cho ${member.username} ăn 1 vả`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const slapEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Dịch vụ vả trực tuyến bởi ${message.author.tag}` })

        return message.reply({ embeds: [slapEmbed] });
    }
}