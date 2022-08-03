//const Discord = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { clientId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Dùng để đá ai đó ra đảo!')
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Dùng để đá ai đó ra đảo!')
                .addUserOption(option => 
                    option.setName('member')
                        .setDescription('Đề cập thành viên cần đá')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('delete_message')
                        .setDescription('Xoá tin nhắn của thành viên bị đá ra đảo. Mặc định sẽ là 24 giờ')
                        .addChoices(
                            { name: 'Giữ lại', value: '0' },
                            { name: 'Xoá toàn bộ tin nhắn từ 24 giờ trước', value: '1' },
                            { name: 'Xoá toàn bộ tin nhắn từ 7 ngày trước', value: '7' }
                        )
                        .setRequired(false))
                .addStringOption(option2 => 
                    option2.setName('reason')
                        .setDescription('Lý do bị đá ra đảo')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('user-by-id')
                .setDescription('Dùng để cấm ai đó vào server!')
                .addStringOption(option =>
                    option.setName('user_id')
                        .setDescription('ID thành viên cần cấm')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Lý do cấm')
                        .setRequired(false))),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
        if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'Mình không có quyền thực hiện điều này ;-;\nHãy bổ sung cho mình quyền BAN_MEMBERS để mình có thể thực hiện theo yêu cầu của bạn.', ephemeral: true });

        if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('member')
            const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id);
            if (!member) return interaction.reply({ content: 'Mình chưa thể cấm thành viên không có trong server bằng ID được .-.', ephemeral: true });
            
            const reason = interaction.options.getString('reason') || 'Không rõ lý do'
            const days = interaction.options.getString('deletelastmessage') || '1'
    
            if (member.id === clientId) return interaction.reply({ content: '<:EH_shock_koishi:806144797383196733>', ephemeral: true });
            if (member.id === interaction.user.id) return interaction.reply({ content: 'Bạn không thể tự đá bản thân ra khỏi server được ;-;', ephemeral: true });
            if (!member.bannable) return interaction.reply({ content: 'Mình không thể đá thành viên này ra được .-.\nCó thể là do họ có quyền cao hơn hoặc được xếp cao hơn mình.', ephemeral: true });
    
            const embed = new EmbedBuilder()
            .setDescription(`**${member.user.tag}** đã bị đá ra đảo với lý do: \`${reason}\``)
            .setColor("Green")
            .setFooter({ text: `BAN_MEMBERS` })
            .setTimestamp()
    
            await member.send(`Bạn đã bị ban khỏi server **\`${interaction.guild.name}\`** với lý do \`${reason}\``).catch(err => console.log(err));
            member.ban({ days, reason })
    
            return interaction.reply({ embeds: [ embed ]});
        } else if (interaction.options.getSubcommand() === 'user-by-id') {
            if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true });
            if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'Mình không có quyền thực hiện điều này ;-;\nHãy bổ sung cho mình quyền BAN_MEMBERS để mình có thể thực hiện theo yêu cầu của bạn.', ephemeral: true });

            const userid = interaction.options.getString('user_id');
            const reason = interaction.options.getString('reason') || 'Không rõ lý do';

            if (isNaN(userid)) return interaction.reply({ content: "ID của người bị cấm chỉ bao gồm các con số thôi mà nhỉ .-.", ephemeral: true });

            if (userid === clientId) return interaction.reply({ content: '<:EH_shock_koishi:806144797383196733>', ephemeral: true });
            if (userid === interaction.user.id) return interaction.reply({ content: 'Bạn không thể tự đá bản thân ra khỏi server được ;-;', ephemeral: true });

            const user = await interaction.client.users.fetch(userid);
            //console.log(user);

            const banidEmbed = new EmbedBuilder()
            .setDescription(`${user.tag} đã bị cấm khỏi server với lý do: \`${reason}\``)
            .setColor('Green')
            .setFooter({ text: 'BAN_MEMBERS' })
            .setTimestamp()

            interaction.guild.members.ban(user, { reason: reason });

            return interaction.reply({ embeds: [banidEmbed] });
        }
    }
};