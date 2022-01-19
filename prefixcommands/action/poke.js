const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../config.json');
const prefixModel = require('../../models/prefix');

module.exports = {
    name: 'poke',
    description: 'Chọc ai đó',
    async execute (client, message) {
        const member = message.mentions.users.first();
        const url = 'https://nekos.life/api/v2/img/poke';

        const prefix_data = await prefixModel.findOne({
            GuildID: message.guild.id
        });

        if (!member) return message.reply({ content: `Bạn biết cách dùng mà, thử lại đi <:dead_inside:933345792465461279>\n||${prefix_data.Prefix}pat [tag người cần chọc]||` });
        if (member.id === message.author.id) return message.reply({ content: 'Bạn không thể tự chọc bản thân được, thay vào đó hãy thử chọc người khác đi :3' });
        if (member.id === clientId) return message.reply({ content: 'XD' });

        let response, data;
        try {
            response = await axios.get(url);
            data = response.data;
        } catch (e) {
            return message.reply(`Error? Có vẻ như API bị die rồi, hãy thử lại lúc khác nhé :>`)
        }

        let randomTitle = [
            `${message.author.username} đã chọc ${member.username}`,
            `${member.username} đã bị chọc bởi ${message.author.username}`
        ]

        const selectedTitle = randomTitle[Math.floor(Math.random() * randomTitle.length)];

        const pokeEmbed = new MessageEmbed()
        .setTitle(`${selectedTitle}`)
        .setColor('RANDOM')
        .setImage(data.url)
        .setFooter({ text: `Hành động bởi ${message.author.tag}` })

        return message.reply({ embeds: [pokeEmbed] });
    }
}