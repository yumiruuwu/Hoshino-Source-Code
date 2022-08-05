const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetimeout')
        .setDescription('Gỡ thành viên khỏi thời gian chờ')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần gỡ khỏi thời gian chờ')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Lý do gỡ khỏi thời gian chờ')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ content: 'Hmm, hình như mình chưa được trao quyền MODERATE_MEMBERS để thực hiện yêu cầu này .-.', ephemeral: true });

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id);

        const reason = interaction.options.getString('reason') || 'Không có lý do';

        if (!member.moderatable) return interaction.reply({ content: 'Mình không thể gỡ người ấy khỏi hàng chờ được vì có thể do họ có quyền hạn cao hơn mình .-.', ephemeral: true });

        member.timeout(null, reason);
        // interaction.reply({ content: 'Tính năng đang thử nghiệm...', ephemeral: true})
        const rtimeoutembed = new EmbedBuilder()
        .setDescription(`Thành viên ${user} đã được gỡ khỏi hàng chờ.\n**Bởi:** ${interaction.user}\n- Lý do: ${reason}`)
        .setColor('Green')
        .setFooter({ text: 'MODERATE_MEMBERS' })
        .setTimestamp()

        await interaction.reply({ embeds: [rtimeoutembed] });
    }
}