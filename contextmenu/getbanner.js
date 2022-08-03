const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: 'Xem biểu ngữ hồ sơ',
    type: '2',
    async execute (client, interaction) {
        try {
            const user = await client.users.fetch(interaction.targetId);

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
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`;

                    const bannerEmbed = new MessageEmbed()
                        .setDescription(`Biểu ngữ hồ sơ của ${user.username || user.tag}`)
                        .setImage(url);

                    interaction.reply({ embeds: [bannerEmbed], ephemeral: false });
                }else {
                    if (accent_color) {
                        const colorEmbed = new MessageEmbed()
                            .setDescription(`${user.username} không có biểu ngữ hồ sơ nhưng người dùng có màu hồ sơ :>`)
                            .setColor(accent_color);

                        interaction.reply({ embeds: [colorEmbed], ephemeral: false });
                    }else{
                        return interaction.reply({ content: `${user.username} không có biểu ngữ hồ sơ và cũng không có màu hồ sơ :v`, ephemeral: false });
                    }
                }
            });
        } catch (err) {
            await interaction.reply({ content: 'uhh.. Hình như đã xảy ra lỗi.', ephemeral: false });
            console.log('Đã xảy ra lỗi', err);
        }
    }
}