const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'Xem ảnh hồ sơ',
    type: '2',
    async execute (client, interaction) {
        try {
            const user = await client.users.fetch(interaction.targetId);

            const avatarEmbed = new MessageEmbed()
            .setTitle(`Ảnh hồ sơ của thành viên ${user.tag}`)
            .setColor(user.displayHexColor)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ text: `${user.username}` })
            .setTimestamp();

            interaction.reply({ embeds: [avatarEmbed], ephemeral: false });
        } catch (err) {
            await interaction.reply({ content: 'uhh.. Hình như đã xảy ra lỗi do thiếu quyền', ephemeral: false });
            console.log('Đã xảy ra lỗi', err);
        }
    }
}