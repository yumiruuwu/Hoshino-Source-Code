const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'pat',
    description: 'Xoa đầu ai đó :3',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/pat';

        if (!member) return message.reply({ content: 'Bạn muốn xoa đầu ai thế <:EH_fusa_cs:807527951612248064>' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Woops? Có vẻ như đã có sự cố xảy ra khi tiến hành theo yêu cầu của bạn .-.`)
        }
        
        const patforyouEmbed = new MessageEmbed()
        .setTitle(`Huh? Để mình xoa đầu bạn nhé :3`)
        .setDescription('Đừng tủi thân nhé! Có mình ở đây rồi :3')
        .setColor('LUMINOUS_VIVID_PINK')
        .setImage(data.url)
        .setFooter({ text: 'Hành động bởi mình :3' })

        if (member.id === message.author.id) return message.reply({ embeds: [patforyouEmbed] });

        let randomTitle = [
            `${message.author.username} đã xoa đầu ${member.username}`,
            `${member.username} được xoa đầu bởi ${message.author.username}`,
            `Pat, pat, pat, pat, still pat... ${member.username} sướng nhé :3`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const patEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        if (member.id === clientId) patEmbed.setDescription('Tăng kìu >w<')

        return message.reply({ embeds: [patEmbed] });
    }
}