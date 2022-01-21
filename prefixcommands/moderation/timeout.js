const { MessageEmbed } = require('discord.js');
const { clientId } = require('../../config.json');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    aliases: ['mute'],
    description: 'Cho thành viên vào hàng chờ',
    async execute (client, message, args) {
        const member = message.mentions.users.first() || await message.guild.members.resolve(args[0]);
        if (!message.member.permissions.has('MODERATE_MEMBERS')) return message.reply({ content: 'Bạn không có quyền được sử dụng lệnh này <:EH_miru_huh:933553804270530590>' });
        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) return message.reply({ content: 'Mình không có quyền để tiến hành yêu cầu của bạn <:EH_miru_huh:933553804270530590>\nHãy thử trao quyền MODERATE_MEMBERS cho mình rồi thử lại nhé!' });

        if (!member) return message.reply({ content: 'Bạn muốn mình đưa ai vào hàng chờ <:EH_miru_huh:933553804270530590>' });
        if (member.id === message.author.id) return message.reply({ content: 'Nếu bạn muốn xếp bản thân vào hàng chờ thì liên hệ với người có quyền lực cao hơn bạn.\n||Trường hợp nếu bạn là chủ nhà thì mình chịu <:EH_fusa_cs:807527951612248064>' });
        if (member.id === clientId) return message.reply({ content: 'Ơ kìa bạn <:EH_miru_huh:933553804270530590>' });

        const user = message.guild.members.cache.get(member.id) || await message.guild.members.fetch(member.id);

        const time = args[1] || '1h';
        const reason = args.slice(2).join(' ') || 'Không rõ lý do';

        const timeout = ms(time); 
        if (timeout == undefined) return message.reply({ content: 'Uhhh... Vui lòng chỉ nhập **1 giá trị** thời gian. Ex: 1w, 1d, 1h hoặc 1m' });
        if (timeout > 2419200000) return message.reply({ content: 'Giá trị thời gian không quá 4 tuần .-.' });
        if (timeout < 60000) return message.reply({ content: 'Nếu bạn muốn mình đưa ai đó vào hàng chờ thì vui lòng chỉnh thời gian lớn hơn 1 phút .-.' });
        const remainingTime = ms(timeout, { long: true });

        user.timeout(timeout, reason);

        const timeoutEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`Thành viên ${member} đã bị xếp vào hàng chờ bởi ${message.author}\n**Lý do:** ${reason}\n**Thời gian:** ${remainingTime}`)
        .setFooter({ text: 'MODERATE_MEMBERS' })
        .setTimestamp()

        return message.reply({ embeds: [timeoutEmbed] });
    }
}