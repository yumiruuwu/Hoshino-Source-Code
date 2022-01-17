//require('discord-together');
const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const { DiscordTogether } = require('discord-together');
const { MessageActionRow, MessageButton } = require('discord.js');

client.discordTogether = new DiscordTogether(client);

const act = {
    youtube: "YouTube Together",
    youtubedev: "YouTube Together Development",
    poker: "Poker Night",
    betrayal: "Betrayal.io",
    fishing: "Fishington.io",
    chess: "Chess In The Park",
    checkers: "Checkers in the Park",
    chessdev: "Chess In The Park Development",
    lettertile: "Letter Tile",
    wordsnack: "Word Snack",
    doodlecrew: "Doodle Crew",
    spellcast: "SpellCast",
    awkword: "Awkword",
    puttparty: "Putt Party"
};

const actimage = {
    youtube: "https://i.imgur.com/OGUMrNf.png",
    youtubedev: "https://i.imgur.com/RpSi5BH.png",
    poker: "https://i.imgur.com/XpRkhsd.jpg",
    betrayal: "https://i.imgur.com/ZewTxtL.png",
    fishing: "https://i.imgur.com/RlwPzJF.png",
    chess: "https://i.imgur.com/kHBxSLv.jpg",
    checkers: "https://i.imgur.com/PDrm3iy.jpg",
    chessdev: "https://i.imgur.com/kHBxSLv.jpg",
    lettertile: "https://i.imgur.com/lHUtqZQ.jpg",
    wordsnack: "https://i.imgur.com/UkATEDX.jpg",
    doodlecrew: "https://i.imgur.com/2z2LymI.jpg",
    spellcast: "https://i.imgur.com/G4jWkUa.png",
    awkword: "https://i.imgur.com/ReXZP8c.png",
    puttparty: "https://i.imgur.com/yF7Jh26.jpg"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activitystart')
        .setDescription('Sử dụng tính năng hoạt động của Discord.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Đề cập kênh voice bạn muốn sử dụng.')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('type')
                .setDescription('Chọn loại hoạt động bạn muốn sử dụng.')
                //.setAutocomplete(true) The slash command builder does not yet support using autocomplete.
                .setRequired(true)
                .addChoice('YouTube Together', 'youtube')
                .addChoice('YouTube Together Development', 'youtubedev') //replica: dm sukayo!!  youtube ở đây đéo ghi hoa
                .addChoice('Poker Night', 'poker')                      //sukayo: cặc, ghi hoa thì nó vẫn vậy thôi, ngu đéo
                .addChoice('Betrayal.io', 'betrayal')                   //replica: cặc, m ghi vậy thì nó chạy được cứt
                .addChoice('Fishington.io', 'fishing')                  //miru: 1 trong 2 chúng mày ghi thêm 1 dòng nữa làm chó
                .addChoice('Chess In The Park', 'chess')                //m.y: bruh :v
                .addChoice('Checkers in the Park', 'checkers')
                .addChoice('Chess In The Park Development', 'chessdev')
                .addChoice('Letter Tile', 'lettertile')
                .addChoice('Word Snack', 'wordsnack')
                .addChoice('Doodle Crew', 'doodlecrew')
                .addChoice('SpellCast', 'spellcast')
                .addChoice('Awkword', 'awkword')
                .addChoice('Putt Party', 'puttparty')),
    async execute (client, interaction) {
        const channel = interaction.options.getChannel('channel');
        const activitytype = interaction.options.getString('type');
        //const channelid = interaction.guild.channels.cache.get(channel.id);

        //console.log(channel, activitytype)

        if (channel.type !== 'GUILD_VOICE') return interaction.reply({ content: 'Kênh Voice được đề cập không hợp lệ.', ephemeral: true });

        client.discordTogether.createTogetherCode(channel.id, activitytype).then(async invite => {
            const activityEmbed = new MessageEmbed()
            //.setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor('RANDOM')
            .setTitle('Đã thiết lập thành công hoạt động!')
            .setDescription(`- Kênh Voice được thiết lập: ${channel}\n- Loại hoạt động: ${act[activitytype]}\n\n- Nếu thấy ổn thì hãy nhấn nút phía dưới để tham gia hoạt động :Đ`)
            .setThumbnail(`${actimage[activitytype]}`)
            //.setFooter('XIII')
            .setFooter({ text: 'XIII'})
            .setTimestamp()

            const joinbutton = new MessageButton()
            .setLabel('Tham gia hoạt động')
            .setStyle('LINK')
            .setURL(`${invite.code}`)

            const row = new MessageActionRow()
            .addComponents(joinbutton)

            return interaction.reply({ embeds: [activityEmbed] ,components: [row] });
        });
    }
}