const { MessageEmbed } = require('discord.js');
const { clientId } = require('../../config.json');

module.exports = {
    name: 'removetimeout',
    aliases: ['unmute', 'rtimeout'],
    description: 'Gỡ thành viên khỏi hàng chờ',
    async execute (client, message, args) {
        const member = message.mentions.users.first() || await message.guild.members.resolve(args[0]);
        if (!message.member.permissions.has('MODERATE_MEMBERS')) return message.reply({ content: 'Bạn không có quyền được sử dụng lệnh này <:EH_miru_huh:933553804270530590>' });
        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) return message.reply({ content: 'Mình không có quyền để tiến hành yêu cầu của bạn <:EH_miru_huh:933553804270530590>\nHãy thử trao quyền MODERATE_MEMBERS cho mình rồi thử lại nhé!' });

        if (!member || user) return message.reply({ content: 'Vui lòng đề cập thành viên cần gỡ khỏi hàng chờ <:EH_miru_huh:933553804270530590>' });
        if (member.id === message.author.id) return message.reply({ content: '<:EH_miru_huh:933553804270530590>' });
        if (member.id === clientId) return message.reply({ content: 'ulatr <:dead_inside:933345792465461279>' });

        const user = message.guild.members.cache.get(member.id) || await message.guild.members.fetch(member.id);

        const reason = args.slice(1).join(' ') || 'Không rõ lý do';

        user.timeout(null, reason);

        const rtimeoutEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Thành viên ${member} đã được gỡ khỏi hàng chờ bởi ${message.author}\n**Lý do:** ${reason}`)
        .setFooter({ text: 'MODERATE_MEMBERS' })
        .setTimestamp()

        return message.reply({ embeds: [rtimeoutEmbed] });
    }
}