const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { clientId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Cho thành viên vào thời gian chờ. Tổng thời gian không quá 28 ngày.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần cho vào thời gian chờ.')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('week')
                .setDescription('Số tuần thời gian chờ.')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('day')
                .setDescription('Số ngày thời gian chờ.')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('hour')
                .setDescription('Số giờ thời gian chờ')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('minute')
                .setDescription('Số phút thời gian chờ')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Lý do cho vào thời gian chờ')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
        // if (!interaction.member.permissions.has("MODERATE_MEMBERS")) {
        //     client.application.commands.permissions.set({ guild: `${interaction.guildId}`, command: `${interaction.commandId}`, permissions: [
        //         {
        //             id: `${interaction.member.id}`,
        //             type: 'USER',
        //             permission: false,
        //         },
        //     ]});

        //     return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
        // };
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Hmm, hình như mình chưa được trao quyền MODERATE_MEMBERS để thực hiện yêu cầu này .-.', ephemeral: true });

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {});

        const weeks = interaction.options.getNumber('week') || '0';
        const days = interaction.options.getNumber('day') || '0';
        const hours = interaction.options.getNumber('hour') || '0';
        const minutes = interaction.options.getNumber('minute') || '0';

        const reason = interaction.options.getString('reason') || 'Không có lý do';

        const m_weeks = weeks * 604800000;
        const m_days = days * 86400000;
        const m_hours = hours * 3600000;
        const m_minutes = minutes * 60000;

        if (user.id === interaction.member.id) return interaction.reply({ content: 'Bạn không thể tự đặt chỗ cho mình vào hàng chờ được .-.', ephemeral: true });
        if (user.id === clientId) return interaction.reply({ content: `<:EH_shock_koishi:806144797383196733>`, ephemeral: true });
        if (!member.moderatable) return interaction.reply({ content: 'Mình không thể xếp người ấy vào hàng chờ được vì có thể do họ có quyền hạn cao hơn mình .-.', ephemeral: true });

        const m_wdhm = m_weeks + m_days + m_hours + m_minutes;
        if (m_wdhm > 2419200000) return interaction.reply({ content: `Giá trị thời gian bạn vừa set đã quá giới hạn cho phép là 4 tuần = 2419200000 milisec. Hãy thử giảm bớt vài ngày hoặc giờ xuống nhé :3\nTham khảo tại [Inch Calculator](https://www.inchcalculator.com/convert/time/)`, ephemeral: true });
        if (m_wdhm < 60000) return interaction.reply({ content: `Giá trị thời gian phải hơn 1 phút .-.`, ephemeral: true });

        member.timeout(m_wdhm, reason);
        // interaction.reply({ content: 'Tính năng đang thử nghiệm...', ephemeral: true})
        const timeoutembed = new MessageEmbed()
        .setTitle('<a:EH_warning:927195307123556362> Timeout System <a:EH_warning:927195307123556362>')
        .setDescription(`- Thành viên ${user} đã bị xếp vào hàng chờ.\n- Lý do: ${reason}\n- Thời gian hàng chờ: ${weeks} tuần ${days} ngày ${hours} giờ ${minutes} phút.`)
        .setColor('YELLOW')
        .setFooter({ text: 'MODERATE_MEMBERS' })
        .setTimestamp()

        await interaction.reply({ embeds: [timeoutembed] });
    }
}