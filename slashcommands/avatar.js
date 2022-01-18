//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Xem ảnh hồ sơ người dùng')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên muốn xem hoặc bỏ trống nếu muốn xem của bản thân.')
                .setRequired(false)),
    async execute (client, interaction) {
        //const avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 1024 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 });

        const user = interaction.options.getUser('user') || interaction.user
        //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id) || interaction.client.users.cache.get(user.id);
        const member = interaction.client.users.cache.get(user.id);

        const image = user.displayAvatarURL({dynamic: true, size: 2048});

        const mentionedEmbed = new MessageEmbed()
        .setTitle(`Ảnh hồ sơ của thành viên ${member.tag}`)
        .setColor('#FFC0CB')
        .setImage(`${image}`)
        //.setFooter(`${interaction.user.username}`)
        .setFooter({ text: `${interaction.user.username}`})
        .setTimestamp();

        await interaction.reply({embeds: [mentionedEmbed]})
    }
};