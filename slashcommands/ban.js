//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Dùng để đá ai đó ra đảo!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Đề cập thành viên cần đá')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('deletelastmessage')
                .setDescription('Xoá tin nhắn của thành viên bị đá ra đảo. Mặc định sẽ là 24 giờ')
                .addChoice('Giữ lại', '0')
                .addChoice('Xoá toàn bộ tin nhắn từ 24 giờ trước', '1')
                .addChoice('Xoá toàn bộ tin nhắn từ 7 ngày trước', '7')
                .setRequired(false))
        .addStringOption(option2 => 
            option2.setName('reason')
                .setDescription('Lý do bị đá ra đảo')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => console.log(err));

        if(!member) return interaction.reply({ content: "Thành viên bạn đề cập không có trong server hoặc không thể đọc được dữ liệu từ thành viên đó.", ephemeral: true });
        const reason = interaction.options.getString('reason') || 'Không rõ lý do'
        const days = interaction.options.getString('deletelastmessage') || '1'

        if(!member.bannable || member.user.id === client.user.id) 
        return interaction.reply("Mình không thể đá thành viên đó ra đảo .-.");

        if(interaction.member.roles.highest.position <= member.roles.highest.position) 
        return interaction.reply('<a:9441uncheckraveninha:882180505892683846> Thành viên được đề cập có role cao hơn hoặc ngang với bạn.')

        const embed = new MessageEmbed()
        .setDescription(`**${member.user.tag}** đã bị đá ra đảo khỉ với lý do: \`${reason}\``)
        .setColor("GREEN")
        //.setFooter("BAN_MEMBER")
        .setFooter({ text: `BAN_MEMBER` })
        .setTimestamp()

        await member.user.send(`Bạn đã bị ban khỏi server **\`${interaction.guild.name}\`** với lý do \`${reason}\``).catch(err => console.log(err))
        member.ban({ days, reason })

        return interaction.reply({ embeds: [ embed ]})
    }
};