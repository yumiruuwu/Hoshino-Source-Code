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
        //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})

        axios
            .get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })
            .then((res) => {
                const { banner, accent_color } = res.data;

                if(banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=2048`;

                    const bannerEmbed = new MessageEmbed()
                        .setDescription(`Biểu ngữ hồ sơ của ${user.username || user.tag}`)
                        .setImage(url);

                    interaction.reply({embeds: [bannerEmbed]});
                }else {
                    if (accent_color) {
                        const colorEmbed = new MessageEmbed()
                            .setDescription(`${user.username} không có biểu ngữ hồ sơ nhưng người dùng có màu hồ sơ :>`)
                            .setColor(accent_color);

                        interaction.reply({embeds: [colorEmbed]});
                    }else{
                        return interaction.reply(`${user.username} không có biểu ngữ hồ sơ và cũng không có màu hồ sơ :v`);
                    }
                }
            });
    }
}