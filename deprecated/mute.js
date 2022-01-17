const ms = require('ms');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Khoá mỏm thành viên :v')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần khoá mỏm')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('time')
                .setDescription('Thời gian mở khoá mỏm. Mặc định và giới hạn là 24 ngày. Ví dụ: 2m, 2h, 2d')
                .setRequired(false))
        .addStringOption(option3 =>
            option3.setName('reason')
                .setDescription('Lý do khoá mỏm')
                .setRequired(false)),
    async execute (interaction) {
        if(!interaction.member.permissions.has("MUTE_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })

        const options = interaction.options._hoistedOptions;

        //const user = interaction.options.getUser('user')
        const user = options.find((e) => e.name === "user")
        //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        const time = interaction.options.getString('time') || '24d'
        const reason = interaction.options.getString('reason') || 'Không có'

        const embed = new MessageEmbed().setColor("GREEN");

        let MutedRole = interaction.guild.roles.cache.find((r) => r.name === "Muted");

        if (!MutedRole) {
            const role = await interaction.guild.roles.create({ name: "Muted" });
    
            interaction.guild.channels.cache.map((x) => {
              if (!x.isThread()) {
                x.permissionOverwrites.edit(
                  role,
                  {
                    MANAGE_WEBHOOKS: false,
                    SEND_MESSAGES: false,
                    USE_PUBLIC_THREADS: false,
                    USE_PRIVATE_THREADS: false,
                    ADD_REACTIONS: false,
                    ATTACH_FILES: false,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_THREADS: false,
                    MANAGE_MESSAGES: false,
                    MENTION_EVERYONE: false,
                    CONNECT: false,
                    SPEAK: false,
                  },
                  reason,
                );
              }
    
              MutedRole = role;
            });
        }

        if (user.member.roles.cache.has(MutedRole.id)) {
            embed.setColor("RED").setDescription(`<a:9441uncheckraveninha:882180505892683846> Thành viên đã bị khoá mỏm trước rồi :v`);
            return await interaction.reply({ embeds: [embed] });
        }

        await user.user.send(`Bạn đã bị khoá mỏm ở server **\`${interaction.guild.name}\`** với lý do \`${reason}\`\nThời gian mở khoá: \`${ms(ms(time))}\``);//.catch(err => {})
        
        await user.member.roles.add(MutedRole);
        embed.setDescription(`<a:1003checkraveninha:882180506127564860> Đã khoá mỏm thành viên ${user.member.toString()}`).addField('Lý do bị khoá mỏm:', reason).addField('Thời gian mở khoá:', `${ms(ms(time))}`)
        await interaction.reply({ embeds: [embed] });

        console.log(ms(ms(time, { long: true })));
        console.log(ms(time));


        if (time) {
            setTimeout(function () {
                user.member.roles.remove(MutedRole);
                //embed.setDescription(`<a:1003checkraveninha:882180506127564860> Đã khoá mỏm thành viên ${user.member.toString()}`).addField('Lý do bị khoá mỏm:', reason).addField('Thời gian mở khoá:', `${ms(time)}`)
            // }, ms(time));
            }, ms(time));
        }
    }
}