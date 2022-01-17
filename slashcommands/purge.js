//const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('[Bugged] Lọc và xoá tin nhắn của ai đó')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên cần xoá tin nhắn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number')
                .setDescription('Số tin nhắn cần xoá')
                .setRequired(false)),
    async execute (client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "Woah, bạn không có quyền sử dụng lệnh này .-.", ephemeral: true })
        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id)
        const number = interaction.options.getString('number');

        if(number) {
            if(number <= 1) return interaction.reply({ content: 'Số lượng tin nhắn cần quét phải lớn hơn 1', ephemeral: true });
            if(number > 100) return interaction.reply({ content: 'Số lượng tin nhắn cần quét không quá 100', ephemeral: true });
            if(isNaN(number)) return interaction.reply({ content: "Số lượng tin nhắn cần quét không thể là chữ cái .-.", ephemeral: true });

            await interaction.channel.messages.fetch({limit: number}).then((messages) =>{
                const userMessages = messages.filter((m) => m.author.id === user.id);
                console.log(userMessages.size);

                interaction.channel.bulkDelete(userMessages, true);

                return interaction.reply({ content: `<a:1003checkraveninha:882180506127564860> Đã xoá ${userMessages.size} tin nhắn từ thành viên ${user}`, ephemeral: true });
            });        
        } else if (!number) {
            await interaction.channel.messages.fetch().then((messages) => {
                const userMessages = messages.filter((m) => m.author.id === user.id);
                console.log(userMessages.size);

                interaction.channel.bulkDelete(userMessages, true);

                return interaction.reply({ content: `<a:1003checkraveninha:882180506127564860> Đã xoá ${userMessages.size} tin nhắn từ thành viên ${user}\n**Note:** Tin nhắn quá 14 ngày sẽ ko thể xoá được và giới hạn tin nhắn được xoá là 100.`, ephemeral: true });
            });   
        }
    }
}

//replica: HELP WANTED!! Ai sửa được cho nó hoạt động đúng theo yêu cầu t cho 500k :>
//miru: Cái này chịu vl, đéo biết sửa sao luôn ấy
//sukayo: Tao nghĩ do cái dòng 27 với 36 ấy, còn lại trông ổn, tao nghĩ vậy
//replica: Hmm, để t xem xét lại :v     Mà không ai muốn 500k thật à :)
//miru: Cho tao 5 triệu đi tao làm cho :))
//replica: Vậy thôi khỏi :)