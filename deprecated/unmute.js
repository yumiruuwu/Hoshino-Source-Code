const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Mở khoá mỏm khi cần thiết')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần mở khoá mỏm')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('reason')
                .setDescription('Lý do mở khoá mỏm')
                .setRequired(false)),
    async execute (interaction) {
        if(!interaction.member.permissions.has("MUTE_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const options = interaction.options._hoistedOptions;

        const user = options.find((e) => e.name === "user")
        const reason = interaction.options.getString('reason') || 'Không có'
        
        let MutedRole = interaction.guild.roles.cache.find((r) => r.name === "Muted");

        const embed = new MessageEmbed().setColor("GREEN");

        if (!user.member.roles.cache.has(MutedRole.id)) {
            embed.setColor("RED").setDescription(`<a:9441uncheckraveninha:882180505892683846> Thành viên không bị khoá mỏm :v`);
            return await interaction.reply({ embeds: [embed] });
        }

        await user.user.send(`Bạn đã được mở khoá mỏm ở server **\`${interaction.guild.name}\`** với lý do \`${reason}\``);//.catch(err => {})

        await user.member.roles.remove(MutedRole);
        embed.setDescription(`<a:1003checkraveninha:882180506127564860> Đã mở khoá mỏm thành viên ${user.member.toString()}`)
        await interaction.reply({ embeds: [embed] });
    }
};