//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Xem biểu ngữ hồ sơ của thành viên!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên muốn xem hoặc để trống nếu muốn xem của bản thân.')
                .setRequired(false)),
    async execute (client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const member = interaction.client.users.cache.get(user.id);

        axios
            .get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })
            .then((res) => {
                const { banner, accent_color } = res.data;

                if(banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;

                    const bannerEmbed = new MessageEmbed()
                        .setDescription(`Biểu ngữ hồ sơ của ${member.tag}`)
                        .setImage(url);

                    interaction.reply({embeds: [bannerEmbed]});
                }else {
                    if (accent_color) {
                        const colorEmbed = new MessageEmbed()
                            .setDescription(`${member.tag} không có biểu ngữ hồ sơ nhưng người dùng có màu hồ sơ :>`)
                            .setColor(accent_color);

                        interaction.reply({embeds: [colorEmbed]});
                    }else{
                        return interaction.reply(`${member.tag} không có biểu ngữ hồ sơ và cũng không có màu hồ sơ :v`);
                    }
                }
            });
    }
}