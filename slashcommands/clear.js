//const Discord = require('discord.js');
const { PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Quét tin nhắn')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Số lượng tin nhắn cần quét [1-100]')
                .setRequired(true)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'Mình không có quyền thực hiện điều này ;-;\nHãy bổ sung cho mình quyền MANAGE_MESSAGES để mình có thể thực hiện theo yêu cầu của bạn.', ephemeral: true });
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'Mình không có đủ quyền để thực hiện theo yêu cầu của bạn, vui lòng hãy kiểm tra và bổ sung quyền MANAGE_MESSAGES ở kênh này cho mình nhé ;-;', ephemeral: true });
        await interaction.deferReply({ ephemeral: true });
        await wait(4000);

        const number = interaction.options.getInteger('number')

        if (number <= 1) return interaction.editReply({ content: "Số lượng tin nhắn cần quét phải lớn hơn 1.", ephemeral: true });
        if (number > 300) return interaction.editReply({ content: "Số lượng tin nhắn cần quét không quá 300.", ephemeral: true });
        if (!number) return interaction.editReply({ content: "Bạn chưa ghi rõ số lượng tin nhắn cần quét .-.", ephemeral: true });
        if(isNaN(number)) return interaction.editReply({ content: "Số lượng tin nhắn cần quét không thể là chữ cái .-.", ephemeral: true });

        if (number <= 100) {
            interaction.channel.messages.fetch({ limit: number }).then(messages => {
                console.log(messages.size);
                //interaction.channel.bulkDelete(messages, true);
                setTimeout(async () => {
                    interaction.channel.bulkDelete(messages, true)
                    return await interaction.editReply({ content: `<a:1003checkraveninha:882180506127564860> Đã quét ${messages.size} tin nhắn`, ephemeral: true });
                }, 0)
                //return interaction.editReply({ content: `<a:1003checkraveninha:882180506127564860> Đã quét ${messages.size} tin nhắn`, ephemeral: true });
            });
        } else if (number <= 200) {
            interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
                // console.log(messages.size);
                interaction.channel.bulkDelete(messages, true);
                const left = number - 100;
                setTimeout(async () => {
                    interaction.channel.bulkDelete(left, true)
                    return await interaction.editReply({ content: `<a:1003checkraveninha:882180506127564860> Đã quét tin nhắn theo số lượng được yêu cầu, tin nhắn quá 14 ngày sẽ không thể xoá được`, ephemeral: true });
                }, 2000)
            });
        } else if (number <= 300) {
            interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
                // console.log(messages.size);
                interaction.channel.bulkDelete(messages, true);
                const left = number - 200;
                setTimeout(async () => {
                    interaction.channel.bulkDelete(left, true)
                    // return await interaction.reply({ content: `<a:1003checkraveninha:882180506127564860> Đã quét ${messages.size + left.size} tin nhắn`, ephemeral: true });
                }, 2000)
                const fleft = left - 0;
                setTimeout(async () => {
                    interaction.channel.bulkDelete(fleft, true)
                    return await interaction.editReply({ content: `<a:1003checkraveninha:882180506127564860> Đã quét tin nhắn theo số lượng được yêu cầu, tin nhắn quá 14 ngày sẽ không thể xoá được`, ephemeral: true });
                }, 2000)
            });
        }
    }
};