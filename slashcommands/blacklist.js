const blacklist = require('../models/blacklist')
//const Discord = require('discord.js');
//const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerId, clientId } = require('../config.json');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Chặn người dùng xài lệnh của bot [Chỉ chủ bot mới xài được]')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Bạn muốn thêm (add) hay gỡ (remove) người dùng khỏi chặn sử dụng lệnh.')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add'},
                    { name: 'remove', value: 'remove'}
                ))
        .addUserOption(option2 =>
            option2.setName('user')
                .setDescription('Dùng ID người dùng để chặn.')
                .setRequired(true)),
    async execute (client, interaction) {
        if (interaction.user.id !== ownerId) return interaction.reply({ content: 'Uhhh oh... Chỉ chủ sở hữu bot mới được phép xài lệnh này .-.' });
        try {
            await interaction.deferReply();
            await wait(4000);
            const action = interaction.options.getString('action')

            if (action === 'add') {
                const user = interaction.options.getUser('user')
                if (user.id === ownerId) return interaction.editReply({ content: 'Nuu, em không muốn thêm chủ nhân của em vào danh sách đen đâu :<' })
                if (user.id === clientId) return interaction.editReply({ content: `<a:blondenekocry:906727644740071424>` })
                //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
                const member = interaction.client.users.cache.get(user.id)

                blacklist.findOne({ id : member }, async(err, data) => {
                    if(err) throw err;
                    if(data) {
                        interaction.editReply({ content: `**${user.tag}** đã có sẵn trong danh sách đen!` });
                    } else if(!data) { //lgtm [js/trivial-conditional]
                        data = new blacklist({ id : member })
                        data.save()
                            .catch(err => console.log(err))
                        interaction.editReply({ content: `**${user.tag}** đã được thêm vào danh sách đen!` })
                    }
                    
                })
            } else if (action === 'remove') {
                const user = interaction.options.getUser('user')
                //const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {}) || interaction.client.users.cache.get(user.id) || await interaction.client.users.fetch(user.id).catch(err => {})
                const member = interaction.client.users.cache.get(user.id)

                blacklist.findOne({ id : member }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        await blacklist.findOneAndDelete({ id : member })
                        .catch(err => console.log(err))
                        interaction.editReply({ content: `**${user.tag}** đã được gỡ bỏ khỏi danh sách đen.` })
                    } else if (!data) { //lgtm [js/trivial-conditional]
                        interaction.editReply({ content: `**${user.tag}** không có trong danh sách đen!`})
                    }
                })
            }
        } catch (err) {
            interaction.reply({ content: 'Đã xảy ra sự cố khi tiến hành lệnh!' })
			console.log("Đã xảy ra lỗi => ", err);
		}
    }
}