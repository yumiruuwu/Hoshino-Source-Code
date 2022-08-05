//const Discord = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Xem biểu ngữ hồ sơ của thành viên.')
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Xem biểu ngữ hồ sơ của thành viên.')
                .addUserOption(option =>
                    option.setName('member')
                        .setDescription('Đề cập thành viên muốn xem hoặc xoá lựa chọn này nếu bạn muốn xem của bản thân.')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('guild')
                .setDescription('Xem biểu ngữ hồ sơ của thành viên trong server này.')
                .addUserOption(option =>
                    option.setName('member')
                        .setDescription('Đề cập thành viên muốn xem hoặc xoá lựa chọn này nếu bạn muốn xem của bản thân.')
                        .setRequired(false))),
    async execute (client, interaction) {
        try {
            if (interaction.options.getSubcommand() === 'user') {
                const user = interaction.options.getUser('member') || interaction.user
                const member = interaction.client.users.cache.get(user.id);

                let res = await fetch.get(`https://discord.com/api/v10/users/${member.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`
                    }
                })

                const { banner, accent_color } = res.data;

                if(banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=4096`;

                    const bannerEmbed = new EmbedBuilder()
                    .setDescription(`Biểu ngữ hồ sơ của thành viên ${member.tag}`)
                    .setImage(url)
                    .setColor(accent_color)
                    .setFooter({ text: `Tương tác bởi ${interaction.user.username}` })
                    .setTimestamp();

                    interaction.reply({embeds: [bannerEmbed]});
                }else {
                    if (accent_color) {

                        const hexARGBColor = accent_color.toString(16);

                        const colorEmbed = new EmbedBuilder()
                        .setDescription(`${member.tag} không có biểu ngữ hồ sơ nhưng người dùng có màu hồ sơ :>\nMã màu: [#${hexARGBColor}](https://www.color-hex.com/color/${hexARGBColor})`)
                        .setColor(accent_color)
                        .setFooter({ text: `Tương tác bởi ${interaction.user.username}` })
                        .setTimestamp();

                        interaction.reply({embeds: [colorEmbed]});
                    }else{
                        return interaction.reply(`${member.tag} không có biểu ngữ hồ sơ và cũng không có màu hồ sơ :v`);
                    }
                }
            } else if (interaction.options.getSubcommand() === 'guild') {
                const user = interaction.options.getUser('member') || interaction.user
                const member = interaction.client.users.cache.get(user.id);

                let res = await fetch.get(`https://discord.com/api/v10/guilds/${interaction.guild.id}/members/${member.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`
                    }
                })

                const { banner } = res.data;

                if (banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    let url = `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${member.id}/banners/${banner}${extension}?size=4096`
                    const pbannerEmbed = new EmbedBuilder()
                    .setTitle(`Biểu ngữ hồ sơ của thành viên ${member.tag} trong server ${interaction.guild}`)
                    .setImage(url)
                    .setColor('#FFC0CB')
                    .setFooter({ text: `Tương tác bởi ${interaction.user.username}`})
                    .setTimestamp()

                    await interaction.reply({ embeds: [pbannerEmbed] });
                } else {
                    await interaction.reply({ content: 'Thành viên không có biểu ngữ hồ sơ trong server này <:EH_fusa_cs:807527951612248064>\nTính năng này chưa được hỗ trợ hoàn toàn nên sẽ không có kết quả nhé :D', ephemeral: true });
                }
            }
        } catch (e) {
            interaction.reply({ content: 'Đã xảy ra sự cố khi tiến hành lệnh!' })
            console.log(e)
        }
    }
}