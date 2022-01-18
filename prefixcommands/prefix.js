const prefixModel = require('../models/prefix');

module.exports = {
    name: 'prefix',
    description: 'Thay đổi prefix của bot cho server này',
    async execute (client, message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply({ content: 'Bạn không có quyền thực hiện điều này .-.', ephemeral: true });

        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        });

        if (!args[0]) return message.reply({ content: `Prefix của server này là **${data.Prefix}**`, ephemeral: true });

        if (args[0].length > 5) return message.reply({ content: `Ký tự được chọn làm prefix không quá 5 ký tự .-.`, ephemeral: true });

        if (data) {
            await prefixModel.findOneAndRemove({
                GuildID: message.guild.id
            });

            message.reply({ content: `Prefix đã được set thành **${args[0]}**` });

            let newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id
            })
            newData.save();
        } else if (!data) {
            message.reply({ content: `Prefix đã được set thành **${args[0]}**` });

            let newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id
            })
            newData.save();
        }
    }
}