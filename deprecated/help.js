const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Cần giúp đỡ?'),
    async execute (client, interaction) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Chọn mục mà bạn muốn xem')
                .addOptions([
                    {
                        label: 'Moderation',
                        description: 'Xem lệnh quản lý.',
                        value: 'mod',
                        emoji: '⚒',
                    },
                    {
                        label: 'Utility',
                        description: 'Xem lệnh tiện ích.',
                        value: 'utility',
                        emoji: '🎬',
                    },
                    {
                        label: 'Coming soon...',
                        description: 'PlaceHolder#1',
                        value: 'soon',
                        emoji: '⏱',
                    },
                    {
                        label: 'Kết thúc tiến trình',
                        description: 'Kết thúc lệnh.',
                        value: 'end',
                        emoji: '❌',
                    },
                ]),
        );

        const mainEmbed = new MessageEmbed()
        .setTitle("Bạn cần giúp đỡ?")
        .setAuthor("Yurin", "https://i.imgur.com/P1y4meo.jpg")
        .setColor('RANDOM')
        .setDescription("- Sử dụng menu chọn phía dưới để chọn mục mà bạn muốn.\n- Lưu ý: Đây là danh sách lệnh slash thôi nhé, sắp tới mình sẽ liệt kê lệnh prefix vào nhé!")
        .setFooter("Thousand Interval")
        .setTimestamp()

        await interaction.reply({ embeds: [mainEmbed], components: [row] });

        const modEmbed = new MessageEmbed()
        .setTitle('Danh sách lệnh Moderation')
        .setAuthor('Yurin', 'https://i.imgur.com/P1y4meo.jpg')
        .setColor('#FF0000')
        .setDescription('- Dưới đây là danh sách lệnh và 1 số vẫn có thể lỗi do mấy bạn nghịch vcl .-.')
        .addFields(
            {name: 'mute', value: 'Dùng để dán mồm thành viên.'},
            {name: 'unmute', value: 'Mở khoá mõm thành viên.'},
            {name: 'ban', value: 'Dùng để đá thành viên ra đảo khỉ.'},
            {name: 'unban', value: 'Dùng để gỡ lệnh cấm thành viên vào nhà.'},
            {name: 'kick', value: 'Dùng để đá thành viên ra khỏi nhà, ra đảo khỉ là khỏi về nhà :).'},
            {name: 'warn', value: 'Dùng để cảnh cáo thành viên.'},
            {name: 'removewarn', value: 'Dùng để xoá cảnh cáo nhất định của thành viên.'},
            {name: 'checkwarn', value: 'Dùng để xem số lần cảnh cáo của thành viên.'},
            {name: 'clearwarn', value: 'Dùng để xoá toàn bộ cảnh cáo của thành viên.'},
            {name: 'clear', value: 'Dùng để xoá số lượng tin nhắn nhất định.'}
        )
        .setFooter('Thousand Interval')

        const utilityEmbed = new MessageEmbed()
        .setTitle('Danh sách lệnh tiện ích')
        .setAuthor('Yurin', 'https://i.imgur.com/P1y4meo.jpg')
        .setColor('#FFA500')
        .setDescription('- Dưới đây là danh sách lệnh tiện ích và 1 số vẫn có thể lỗi do mấy bạn lì vcl .-.')
        .addFields(
            {name: 'getbanner', value: 'Dùng để lấy biểu ngữ hồ sơ của thành viên trong Server.'},
            {name: 'ping', value: 'Dùng để kiểm tra độ phản hồi của bot.'},
            {name: 'avatar', value: 'Dùng để xem ảnh hồ sơ của người dùng.'},
            {name: 'whois', value: 'Dùng để xem thông tin thành viên.'},
            {name: 'serverinfo', value: 'Dùng để xem thông tin Server.'},
            {name: 'activitystart', value: 'Sử dụng tính năng activites của Discord, sắp tới tính năng này sẽ bị xoá bỏ khỏi bot vì Discord sẽ phát hành activities trực tiếp vào kênh Voice.'},
            {name: 'changelog', value: 'Xem sự thay đổi của bot qua các phiên bản.'},
            {name: 'Coming soon', value: '...'}
        )
        .setFooter('Thousand Interval')

        client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            const value = interaction.values[0];
        
            if (value === 'mod') {
                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [modEmbed], components: [row] });
            } else if (value === 'utility') {
                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [utilityEmbed], components: [row] });
            } else if (value === 'soon') {
                await interaction.deferUpdate();
                await interaction.editReply({ content: 'Sắp ra mắt', embeds: [], components: [row] });
            } else if (value === 'end') {
                //await interaction.deferUpdate();
                await interaction.update({ content: 'Đã kết thúc tiến trình', embeds: [], components: [] });
            }
        });
    }
}
