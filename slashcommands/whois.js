//const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment-timezone');
//const wait = require('util').promisify(setTimeout);

const status = {
    online: "Trực tuyến",
    idle: "Chế độ chờ/Nhàn rỗi",
    dnd: "Vui lòng không làm phiền",
    offline: "Ngoại tuyến/Ẩn",
    undefined: "Ngoại tuyến/Ẩn",
};

const dvc = {
    web: "Trình duyệt",
    desktop: "Máy tính bàn/Laptop",
    mobile: "Điện thoại"
};

const locale = {
    'en-US': 'Tiếng Anh (Mỹ)',
    'en-GB': 'Tiếng Anh (Anh)',
    bg: 'Tiếng Bungari',
    'zh-CN': 'Tiếng Trung Quốc',
    'zh-TW': 'Tiếng Đài Loan',
    hr: 'Tiếng Croatia',
    cs: 'Tiếng Séc',
    da: 'Tiếng Đan Mạch',
    nl: 'Tiếng Hà Lan',
    fi: 'Tiếng Phần Lan',
    fr: 'Tiếng Pháp',
    de: 'Tiếng Đức',
    el: 'Tiếng Hy Lạp',
    hi: 'Tiếng Hindi',
    hu: 'Tiếng Hungary',
    it: 'Tiếng Ý',
    ja: 'Tiếng Nhật',
    ko: 'Tiếng Hàn Quốc',
    lt: 'Tiếng Litva',
    no: 'Tiếng Na Uy',
    pl: 'Tiếng Ba Lan',
    'pt-BR': 'Tiếng Bồ Đào Nha',
    ro: 'Tiếng Rumani',
    ru: 'Tiếng Nga',
    'es-ES': 'Tiếng Tây Ban Nha',
    'sv-ES': 'Tiếng Thuỵ Điển',
    th: 'Tiếng Thái',
    tr: 'Tiếng Thổ Nhĩ Kỳ',
    uk: 'Tiếng Ukraina',
    vi: 'Tiếng Việt'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Xem thông tin thành viên.')
        .addStringOption(option2 =>
            option2.setName('private')
                .setDescription('Chọn Yes nếu bạn muốn xem 1 mình, chọn No nếu bạn muốn người khác có thể xem cùng.')
                .setRequired(true)
                .addChoice('Yes', 'yes')
                .addChoice('No', 'no'))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Đề cập thành viên muốn xem hoặc bỏ trống nếu muốn xem của bản thân.')
                .setRequired(false)),
    async execute (client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id) || interaction.client.users.cache.get(user.id)

        const choice = interaction.options.getString('private');

        var permissions = [];
        var acknowledgements = 'Member';

        if(member.permissions.has("ADMINISTRATOR")){
            permissions.push("Administrator");
        }

        if(member.permissions.has("MANAGE_GUILD")){
            permissions.push("Manage Guild")
        }

        if(member.permissions.has("KICK_MEMBERS")){
            permissions.push("Kick Members");
        }
        
        if(member.permissions.has("BAN_MEMBERS")){
            permissions.push("Ban Members");
        }

        if(member.permissions.has("MODERATE_MEMBERS")){
            permissions.push("Moderate Members");
        }
    
        if(member.permissions.has("MANAGE_MESSAGES")){
            permissions.push("Manage Messages");
        }
        
        if(member.permissions.has("MANAGE_CHANNELS")){
            permissions.push("Manage Channels");
        }
        
        if(member.permissions.has("MENTION_EVERYONE")){
            permissions.push("Mention Everyone");
        }
    
        if(member.permissions.has("MANAGE_NICKNAMES")){
            permissions.push("Manage Nicknames");
        }
    
        if(member.permissions.has("MANAGE_ROLES")){
            permissions.push("Manage Roles");
        }
    
        if(member.permissions.has("MANAGE_WEBHOOKS")){
            permissions.push("Manage Webhooks");
        }
    
        if(member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")){
            permissions.push("Manage Emojis & Stickers");
        }
    
        if(permissions.length == 0){
            permissions.push("Không có");
        }

        if(member.permissions.has("MANAGE_GUILD" || "KICK_MEMBERS" || "BAN_MEMBERS" || "MODERATE_MEMBERS")) {
            acknowledgements = 'Staff'
        }

        if(member.permissions.has("ADMINISTRATOR")) {
            acknowledgements = 'Admin'
        }

        if(member.user.id == interaction.guild.ownerId){
            acknowledgements = 'Owner';
        }

        const activities = [];
        let customStatus = 'Thành viên không có Custom Status';
        for (const activity of member.presence?.activities.values() || []) {
            switch (activity.type) {
                case 'PLAYING':
                    activities.push(`Đang chơi **${activity.name}**`);
                    break;
                case 'LISTENING':
                    if (member.user.bot) activities.push(`Đang lắng nghe **${activity.name}**`);
                    else activities.push(`Đang nghe nhạc **${activity.details}** bởi **${activity.state}**`);
                    break;
                case 'WATCHING':
                    activities.push(`Đang xem **${activity.name}**`);
                    break;
                case 'STREAMING':
                    activities.push(`Đang phát trực tiếp **${activity.name}**`);
                    break;
                case 'CUSTOM':
                    customStatus = `${activity.state}`;
                    break;
            }
        }

        const devices = member.presence?.clientStatus || {};
        const entries = Object.entries(devices).map((value) => `${dvc[value[0]]}`).join(", ");

        const whoisembed = new MessageEmbed()
        //.setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
        .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
        .setColor(member.displayHexColor)
        //.setFooter(`ID: ${member.user.id}`)
        .setFooter({ text: `ID: ${member.user.id}` })
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        .addField("__Trạng thái__:",`${status[member.presence?.status]}`, true)
        .addField('__Ngày tham gia server__:',`${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format("[Ngày] D [tháng] M [năm] YYYY, HH:mm:ss")}`, true)
        .addField('__Tài khoản tạo lúc__:',`${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format("[Ngày] D [tháng] M [năm] YYYY, HH:mm:ss")}`, true)
        .addField('__Ngôn ngữ thường dùng (PC Client Only)__:', `${locale[interaction.locale]}`)
        .addField(`__Vai trò [${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `\`${roles.name}\``).length}]:__`,`${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "Không có vai trò"}`, true)
        .addField("__Vị trí trong server:__", `${acknowledgements}`, true)
        .addField("__Quyền hạn:__", `${permissions.join(` | `)}`)
        .addField('__Nền tảng đang sử dụng:__', `${entries || 'Thành viên đang ngoại tuyến'}`);
        if (activities.length > 0) whoisembed.setDescription(`**__Hoạt động của thành viên:__** <@!${member.user.id}>\n${activities.join('\n')}`);
        // if (activities) whoisembed.setDescription(activities.map((x, i) => `**${x.type}**: \`${x.name || "None"} : ${x.details || "None"} : ${x.state || "None"}\``).join("\n"))
        if (customStatus) whoisembed.addFields({ name: '__Custom Status:__', value: `${customStatus}` });
        // console.log(entries);
        // console.log(devices);
        //console.log(interaction.id);
        try {
            if (choice === 'yes') {
                // await interaction.deferReply({ ephemeral: true });
                // await wait(4000);
                await interaction.reply({ embeds: [whoisembed], ephemeral: true });
            } else if (choice === 'no') {
                // await interaction.deferReply();
                // await wait(4000);
                await interaction.reply({ embeds: [whoisembed], ephemeral: false });
            }
        } catch (err) {
            console.log("Đã xảy ra lỗi => ", err);
        }
    }
}