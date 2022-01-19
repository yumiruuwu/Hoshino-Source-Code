const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');

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
    name: 'serverinfo',
    aliases: 'server, svin4',
    description: 'Xem thông tin server',
    async execute (client, message) {
        //Get server information
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;
        const stickers = message.guild.stickers.cache;

        //Get server members
        const memberstatus = await message.guild.members.fetch()//.filter(member => !member.user.bot && member.presence.status === 'online').size;
        const onlineMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'online').size;
        const idleMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'idle').size;
        const dndMembers = memberstatus.filter(member => !member.user.bot && member.presence?.status === 'dnd').size;
        let offlineMembers = onlineMembers + idleMembers + dndMembers;
        const totalMem = message.guild.memberCount - message.guild.members.cache.filter(m => m.user.bot).size;

        const infoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`**Trạng thái:**\n${onlineMembers}<:online:915438585858125854> | ${idleMembers}<:idle:915438585489031219> | ${dndMembers}<:dnd:915438585832931328> | ${totalMem - offlineMembers}<:offline:915438050505543750>`)
        .setThumbnail(message.guild.iconURL({dynamic: true, size: 2048}))
        .addField('╔**THÔNG TIN SERVER**', `╠**__Tên Server:__** ${message.guild.name}\n╠**__ID Server:__** ${message.guild.id}\n╠**__Khu vực Server:__** ${locale[message.guild.preferredLocale]}\n╠**__Chủ Server:__** <@!${message.guild.ownerId}>\n╠**__ID Chủ Server:__** ${message.guild.ownerId}\n╠**__Ngày thành lập:__** ${moment(message.guild.createdAt).tz('Asia/Ho_Chi_Minh').format('[Ngày] D [tháng] M [năm] YYYY, HH:mm:ss')}\n╠**__Vai trò:__** ${roles.length}\n╚**__Mức độ NSFW:__** ${nsfwLv[message.guild.nsfwLevel]}\n\n`)
        .addField('╔**SERVER BOOST**', `╠**__Số Boost của Server:__** ${message.guild.premiumSubscriptionCount || '0'} <:boost_badge:888719197792763924>\n╚**__Cấp:__** ${tier[message.guild.premiumTier]}`)
        .addField('╔**BẢO MẬT SERVER**', `╠**__Mức độ xác minh:__** ${verificationLevels[message.guild.verificationLevel]}\n╠**__Cấp độ lọc nội dung:__** ${filterLevels[message.guild.explicitContentFilter]}\n╚**__Yêu cầu 2FA cho Moderator:__** ${mfa[message.guild.mfaLevel]}`, true)
        .addField('╔**KHU VỰC AFK**', `╠**__Thời gian AFK:__** ${message.guild.afkTimeout / 60} phút\n╚**__Kênh AFK:__** ${message.guild.afkChannel || 'Server không có kênh AFK'}`)
        .addField('╔**THÀNH VIÊN**', `╠**__Tổng:__** ${message.guild.memberCount} người dùng.\n╠**__Thành viên:__** ${totalMem} bé :>\n╚**__Bot:__** ${message.guild.members.cache.filter(m => m.user.bot).size} 🤖`)
        .addField('╔**EMOJI/STICKER**', `╠**__Tổng:__** ${emojis.size}\n╠**__Emoji:__** ${emojis.filter(emoji => !emoji.animated).size}\n╠**__Emoji động:__** ${emojis.filter(emoji => emoji.animated).size}\n╚**__Sticker:__** ${stickers.size}`)
        .addField('╔**CHANNEL**', `╠**__Tổng:__** ${channels.size} kênh.\n╠**__Kênh nhắn:__** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size} kênh.\n╠**__Kênh voice:__** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size} kênh.\n╚**__Danh mục:__** ${channels.filter(channel => channel.type === 'GUILD_CATEGORY').size} mục.`)
        .setTimestamp()

        return message.reply({ embeds: [infoEmbed] });
    }
}