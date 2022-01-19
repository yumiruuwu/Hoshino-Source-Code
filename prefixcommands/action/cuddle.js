const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'cuddle',
    description: 'Âu yếm/Ôm ấp ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/cuddle';

        if (!member) return message.reply({ content: 'Bạn cần tag người cần âu yếm vào <:EH_miru_huh:933256778915905596>' });
        if (member.id === message.author.id) return message.reply({ content: 'Bạn đang tự âu yếm bản thân à <:EH_oh:864786939593228289>' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Xin lỗi vì đã làm gián đoạn 2 người nhưng API của mình die rồi <:catok:933309520493576242> và mình cần API để giúp 2 bạn âu yếm online nên hãy thử lại lúc khác nhé!`)
        }

        let randomTitle = [
            `${message.author.username} đã âu yếm ${member.username}`,
            `${member.username} đang được âu yếm bởi ${message.author.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const cuddleEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        if (member.id === clientId) cuddleEmbed.setDescription(`OwO, cảm ơn bạn nhé!!`)

        return message.reply({ embeds: [cuddleEmbed] });
    }
}