//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment-timezone');
//const wait = require('util').promisify(setTimeout);

const mfa = {
    NONE: "Không",
    ELEVATED: "Có",
};

const nsfwLv = {
    DEFAULT: 'Mặc định',
    EXPLICIT: 'Không phù hợp',
    SAFE: 'An toàn',
    AGE_RESTRICTED: 'Giới hạn độ tuổi',
};

const filterLevels = {
    DISABLED: 'Không quét.',
    MEMBERS_WITHOUT_ROLES: 'Chỉ quét nội dung của thành viên không có role.',
    ALL_MEMBERS: 'Quét tất cả nội dung của các thành viên.'
};

const verificationLevels = {
    NONE: 'Không giới hạn',
    LOW: 'Thấp .-.',
    MEDIUM: 'Trung bình',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

// const regions = {
//     brazil: 'Brazil',
//     europe: 'Europe',
//     hongkong: 'Hong Kong',
//     india: 'India',
//     japan: 'Japan',
//     russia: 'Russia',
//     singapore: 'Singapore',
//     southafrica: 'South Africa',
//     sydeny: 'Sydeny',
//     'us-central': 'US Central',
//     'us-east': 'US East',
//     'us-west': 'US West',
//     'us-south': 'US South'
// }; Đã thay thế bằng guildLocale

const tier = {
    NONE: '0',
    TIER_1: '1',
    TIER_2: '2',
    TIER_3: '3'
};

const locale = {
    'en-US': 'Hoa Kỳ',
    //'en-GB': 'Vương quốc Anh', guildLocale chỉ có 29 ngôn ngữ được chấp nhận, tiếng Anh Anh với tiếng Anh Mỹ được gộp làm 1
    bg: 'Bulgaria',
    'zh-CN': 'Trung Quốc',
    'zh-TW': 'Đài Loan',
    hr: 'Croatia',
    cs: 'Czech',
    da: 'Đan Mạch',
    nl: 'Hà Lan',
    fi: 'Phần Lan',
    fr: 'Pháp',
    de: 'Đức',
    el: 'Hy Lạp',
    hi: 'Ấn Độ',
    hu: 'Hungary',
    it: 'Ý',
    ja: 'Nhật Bản',
    ko: 'Hàn Quốc',
    lt: 'Litva',
    no: 'Na Uy',
    pl: 'Ba Lan',
    'pt-BR': 'Bồ Đào Nha',
    ro: 'Romania',
    ru: 'Nga',
    'es-ES': 'Tây Ban Nha',
    'sv-ES': 'Thuỵ Điển',
    th: 'Thái Lan',
    tr: 'Thổ Nhĩ Kỳ',
    uk: 'Ukraina',
    vi: 'Việt Nam'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Xem thông tin Server'),
    async execute (client, interaction) {
        // await interaction.deferReply();
        // await wait(4000);
        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        //const members = interaction.guild.members.cache;
        //const guild = member.guild;
        //const members = guild.members.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;
        const stickers = interaction.guild.stickers.cache;
        //const guild = client.guilds.get(interaction.guild.id);
        // const guildLocale = interaction.guildLocale;
        // console.log(guildLocale);

        const memberstatus = await interaction.guild.members.fetch()//.filter(member => !member.user.bot && member.presence.status === 'online').size;
        const onlineMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'online').size;
        const idleMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'idle').size;
        const dndMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'dnd').size;
        let offlineMembers = onlineMembers + idleMembers + dndMembers;
        const totalMem = interaction.guild.memberCount - interaction.guild.members.cache.filter(i => i.user.bot).size;
        //const undefinedMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'undefined').size;
        
        const infoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`**Trạng thái:**\n${onlineMembers}<:online:915438585858125854> | ${idleMembers}<:idle:915438585489031219> | ${dndMembers}<:dnd:915438585832931328> | ${totalMem - offlineMembers}<:offline:915438050505543750>`)
        .setThumbnail(interaction.guild.iconURL({dynamic: true, size: 2048}))
        //.addField('╔**THÔNG TIN SERVER**', `╠**__Tên Server:__** ${interaction.guild.name}\n╠**__ID Server:__** ${interaction.guild.id}\n╠**__Chủ Server:__** <@!${interaction.guild.ownerId}>\n╠**__ID Chủ Server:__** ${interaction.guild.ownerId}\n╠**__Ngày thành lập:__** ${interaction.guild.createdAt.toLocaleString()}\n╠**__Vai trò:__** ${roles.length}\n╚**__Mức độ NSFW:__** ${nsfwLv[interaction.guild.nsfwLevel]}\n\n`)
        .addField('╔**THÔNG TIN SERVER**', `╠**__Tên Server:__** ${interaction.guild.name}\n╠**__ID Server:__** ${interaction.guild.id}\n╠**__Khu vực Server:__** ${locale[interaction.guildLocale]}\n╠**__Chủ Server:__** <@!${interaction.guild.ownerId}>\n╠**__ID Chủ Server:__** ${interaction.guild.ownerId}\n╠**__Ngày thành lập:__** ${moment(interaction.guild.createdAt).tz('Asia/Ho_Chi_Minh').format('[Ngày] D [tháng] M [năm] YYYY, HH:mm:ss')}\n╠**__Vai trò:__** ${roles.length}\n╚**__Mức độ NSFW:__** ${nsfwLv[interaction.guild.nsfwLevel]}\n\n`)
        //.addField('_ _', `\n\u200b`)
        .addField('╔**SERVER BOOST**', `╠**__Số Boost của Server:__** ${interaction.guild.premiumSubscriptionCount || '0'} <:boost_badge:888719197792763924>\n╚**__Cấp:__** ${tier[interaction.guild.premiumTier]}`)
        .addField('╔**BẢO MẬT SERVER**', `╠**__Mức độ xác minh:__** ${verificationLevels[interaction.guild.verificationLevel]}\n╠**__Cấp độ lọc nội dung:__** ${filterLevels[interaction.guild.explicitContentFilter]}\n╚**__Yêu cầu 2FA cho Moderator:__** ${mfa[interaction.guild.mfaLevel]}`, true)
        .addField('╔**KHU VỰC AFK**', `╠**__Thời gian AFK:__** ${interaction.guild.afkTimeout / 60} phút\n╚**__Kênh AFK:__** ${interaction.guild.afkChannel || 'Server không có kênh AFK'}`)
        .addField('╔**THÀNH VIÊN**', `╠**__Tổng:__** ${interaction.guild.memberCount} người dùng.\n╠**__Thành viên:__** ${interaction.guild.memberCount - interaction.guild.members.cache.filter(i => i.user.bot).size} bé :>\n╚**__Bot:__** ${interaction.guild.members.cache.filter(i => i.user.bot).size} 🤖`)
        .addField('╔**EMOJI/STICKER**', `╠**__Tổng:__** ${emojis.size}\n╠**__Emoji:__** ${emojis.filter(emoji => !emoji.animated).size}\n╠**__Emoji động:__** ${emojis.filter(emoji => emoji.animated).size}\n╚**__Sticker:__** ${stickers.size}`)
        .addField('╔**CHANNEL**', `╠**__Tổng:__** ${channels.size} kênh.\n╠**__Kênh nhắn:__** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size} kênh.\n╠**__Kênh voice:__** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size} kênh.\n╚**__Danh mục:__** ${channels.filter(channel => channel.type === 'GUILD_CATEGORY').size} mục.`)
        //.addField(`**__Role(s) [${roles.length}]:__**`, roles.join(', '))
        .setTimestamp()

        await interaction.reply({ embeds: [infoEmbed] });
    }
}