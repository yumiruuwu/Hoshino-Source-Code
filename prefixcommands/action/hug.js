const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'hug',
    description: 'Ôm ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/hug';

        if (!member) return message.reply({ content: 'Vui lòng tag người để ôm <:EH_fusa_cs:807527951612248064>' })

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Xin lỗi vì đã làm gián đoạn cái ôm ấm áp của 2 người nhưng API của mình die rồi <:catok:933309520493576242>\nMình cần API để hoạt động nên vui lòng thử lại lúc khác nhé!`)
        }

        const hugwithyouEmbed = new MessageEmbed()
        .setTitle('Không sao, để mình ôm bạn :3')
        .setColor('LUMINOUS_VIVID_PINK')
        .setDescription(`Có vẻ như ${message.author.username} đang cảm thấy tủi thân. Mình hi vọng các bạn khác có thể an ủi bạn ấy nhé <3`)
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi mình :3` })

        if (member.id === message.author.id) return message.reply({ embeds: [hugwithyouEmbed] });

        let randomTitle = [
            `${message.author.username} đã ôm ${member.username}`,
            `${member.username} đang được ôm bởi ${message.author.username}`,
            `${message.author.username} đã ôm thật chặt ${member.username} vào lòng <3`,
            `${member.username} đã lọt vào vòng tay yêu thương của ${message.author.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const hugEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        if (member.id === clientId) hugEmbed.setDescription(`Rất là huggy :3`)

        return message.reply({ embeds: [hugEmbed] });
    }
}