const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Hiển thị tất cả các lệnh',
    async execute (client, message) {
        message.channel.sendTyping();
        const directories = [
            ...new Set(client.prefixcommands.map((cmd) => cmd.directory)),
        ];
        
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.prefixcommands.filter((cmd) => cmd.directory === dir).map((cmd) => {
                return {
                    name: cmd.name || 'Không có tên',
                    description: cmd.description || 'Không có thông tin',
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const helpEmbed = new MessageEmbed()
        .setTitle('Bạn cần giúp đỡ?')
        .setColor('GREEN')
        .setDescription('Vui lòng sử dụng menu chọn phía dưới để chọn mục mà bạn muốn xem :D\n**Lưu ý:** Tiến trình này chỉ có 60 giây để phản hồi, tức là sau khi hết 60 giây thì tiến trình này sẽ không sử dụng được nữa.')

        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('help-menu')
                    .setPlaceholder('Vui lòng chọn 1 mục')
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Xem các lệnh thuộc mục ${cmd.directory}`,
                            };
                        })
                    )
            ),
        ];

        const initialMessage = await message.reply({
            embeds: [helpEmbed],
            components: components(false),
        });

        const collector = message.channel.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 60000,
        });

        collector.on('collect', (interaction) => {
            if (interaction.user.id !== message.author.id) {
                interaction.reply({ content: `Này ${interaction.user}!! Đây không phải tiến trình của bạn nên đừng nghịch >:(`, ephemeral: true });
                return;
            }
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new MessageEmbed()
            .setTitle(`Danh sách lệnh thuộc mục ${directory[0].toUpperCase() + directory.substr(1)}`)
            .setColor('RANDOM')
            .setDescription(`1 số lệnh có thể không xuất hiện trong danh sách do chưa được sắp xếp .-.`)
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    };
                })
            );

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            initialMessage.edit({ components: components(true) });
        })
    }
}