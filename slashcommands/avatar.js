//const Discord = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Xem ảnh hồ sơ người dùng.')
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Xem ảnh hồ sơ của thành viên.')
                .addUserOption(option =>
                    option.setName('member')
                        .setDescription('Đề cập thành viên muốn xem hoặc xoá lựa chọn này nếu muốn xem của bản thân.')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('guild')
                .setDescription('Xem ảnh hồ sơ của thành viên trong server này.')
                .addUserOption(option =>
                    option.setName('member')
                        .setDescription('Đề cập thành viên muốn xem hoặc xoá lựa chọn này nếu muốn xem của bản thân.')
                        .setRequired(false))),
    async execute (client, interaction) {
        try {
            if (interaction.options.getSubcommand() === 'user') {
                const user = interaction.options.getUser('member') || interaction.user
                //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id) || interaction.client.users.cache.get(user.id);
                const member = interaction.client.users.cache.get(user.id);

                const image = user.displayAvatarURL({dynamic: true, size: 4096});

                const mentionedEmbed = new EmbedBuilder()
                .setTitle(`Ảnh hồ sơ của thành viên ${member.tag}`)
                .setColor('#FFC0CB')
                .setImage(`${image}`)
                .setFooter({ text: `Tương tác bởi ${interaction.user.username}`})
                .setTimestamp();

                await interaction.reply({embeds: [mentionedEmbed]})
            } else if (interaction.options.getSubcommand() === 'guild') {
                const user = interaction.options.getUser('member') || interaction.user
                //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id) || interaction.client.users.cache.get(user.id);
                const member = interaction.client.users.cache.get(user.id);

                let res = await fetch.get(`https://discord.com/api/v10/guilds/${interaction.guild.id}/members/${member.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`
                    }
                })

                if (res.data.avatar !== undefined && res.data.avatar !== null) {
                    const extension = res.data.avatar.startsWith("a_") ? ".gif" : ".png";
                    let url = `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${member.id}/avatars/${res.data.avatar}${extension}?size=4096`
                    const pavEmbed = new EmbedBuilder()
                    .setTitle(`Ảnh hồ sơ của thành viên ${member.tag} trong server ${interaction.guild}`)
                    .setImage(url)
                    .setColor('#FFC0CB')
                    .setFooter({ text: `Tương tác bởi ${interaction.user.username}`})
                    .setTimestamp()

                    await interaction.reply({ embeds: [pavEmbed] });
                } else {
                    const navEmbed = new EmbedBuilder()
                    .setTitle(`Ảnh hồ sơ của thành viên ${member.tag}`)
                    .setDescription(`Hmm, có vẻ như thành viên này không có ảnh hồ sơ riêng trong server này <:EH_fusa_cs:807527951612248064>`)
                    .setColor('#FFC0CB')
                    .setImage(member.displayAvatarURL({dynamic: true, size: 4096}))
                    .setFooter({ text: `Tương tác bởi ${interaction.user.username}`})
                    .setTimestamp()

                    await interaction.reply({embeds: [navEmbed] });
                }
            }
        } catch (e) {
            interaction.reply({ content: 'Đã xảy ra sự cố khi tiến hành lệnh!' })
            console.log(e)
        }
    }
};