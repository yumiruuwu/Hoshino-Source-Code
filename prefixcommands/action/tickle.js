const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'tickle',
    description: 'Làm nhột ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/tickle';

        if (!member) return message.reply({ content: 'Cái tag đâu rồi <:dead_inside:933345792465461279>' });
        
        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Oops!? Đã có sự cố xảy ra và mình không thể sửa được, chắc phải để lúc khác thử lại nhé bạn :>`)
        }

        const tickleforyouEmbed = new MessageEmbed()
        .setTitle('Thọc cù lét nè...')
        .setDescription('Nếu muốn nữa thì cứ kêu mình XD\n**Nhớ xin phép chủ nhà trước nhé!**')
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: 'Hành động bởi mình :3' })

        if (member.id === message.author.id) return message.reply({ embeds: [tickleforyouEmbed] });

        let randomTitle = [
            `${message.author.username} đã thọc lét ${member.username}`,
            `${member.username} đã bị làm nhột bởi ${message.author.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const tickleEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        if (member.id === clientId) tickleEmbed.setDescription('XD')

        return message.reply({ embeds: [tickleEmbed] });
    }
}