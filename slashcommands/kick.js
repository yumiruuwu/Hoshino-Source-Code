//const Discord = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Dùng để đá ai đó ra khỏi nhà!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Đề cập thành viên cần đá')
                .setRequired(true))
        .addStringOption(option2 => 
            option2.setName('reason')
                .setDescription('Lý do bị đá')
                .setRequired(true)),
    async execute (client, interaction) {
        //const options = interaction.options._hoistedOptions;
        if(!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id)

        if(!member) return interaction.reply({ content: "Thành viên bạn đề cập không có trong server hoặc không thể đọc được dữ liệu từ thành viên đó.", ephemeral: true });
        const reason = interaction.options.getString('reason')

        if(!member.kickable || member.user.id === client.user.id) return interaction.reply("Mình không thể đá thành viên đó ra khỏi nhà.");
        if(interaction.user.id === member.user.id) return interaction.reply("Bạn không thể tự đá bản thân ra khỏi nhà được :v");
        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply(`<a:9441uncheckraveninha:882180505892683846> Thành viên được đề cập có role cao hơn hoặc ngang với bạn.`)

        const kickembed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** đã bị đá ra khỏi nhà với lý do: \`${reason}\``)
        .setColor("GREEN")
        //.setFooter("KICK_MEMBERS")
        .setFooter({ text: 'KICK_MEMBERS' })
        .setTimestamp()

        await member.user.send(`Bạn đã bị đá ra khỏi server **\`${interaction.guild.name}\`** với lý do \`${reason}\``)
        member.kick({ reason: reason })

        return interaction.reply({ embeds: [kickembed] })
    }
};