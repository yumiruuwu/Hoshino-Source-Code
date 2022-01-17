//const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const status = {
    online: "Trực tuyến",
    idle: "Chế độ chờ/Nhàn rỗi",
    dnd: "Vui lòng không làm phiền",
    offline: "Ngoại tuyến/Ẩn",
};

const dvc = {
    web: "Trình duyệt",
    desktop: "Máy tính bàn/Laptop",
    mobile: "Điện thoại"
};

module.exports = {
    name: 'whois',
    aliases: ['userinfo'],
    description: 'Xem thông tin thành viên',
    async execute (Client, message, args, Discord) {
        var permissions = [];
        var acknowledgements = 'None';

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

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
    
        if(member.user.id == message.guild.ownerID){
            acknowledgements = 'Chủ nhà';
        }

        const activities = [];
        let customStatus = 'Thành viên không có Custom Status';
        for (const activity of member.presence.activities.values()) {
            switch (activity.type) {
                case 'PLAYING':
                    activities.push(`Đang chơi **${activity.name}**`);
                    break;
                case 'LISTENING':
                    if (member.user.bot) activities.push(`Listening to **${activity.name}**`);
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
            .setAuthor({ name: `${member.user.tag}`, iconURL: `member.user.displayAvatarURL()` })
            .setColor(member.displayHexColor)
            //.setFooter(`ID: ${member.user.id}`)
            .setFooter({ text: `ID: ${member.user.id}` })
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setTimestamp()
            .addField("__Trạng thái__:",`${status[member.presence.status]}`, true)
            .addField('__Ngày tham gia server__:',`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField('__Tài khoản tạo lúc__:', member.user.createdAt.toLocaleString(), true)
            .addField(`\n__Vai trò [${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]__`,`${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "Không có vai trò"}`, true)
            .addField("\n__Acknowledgements__:", `${acknowledgements}`, true)
            .addField("\n__Quyền hạn__:", `${permissions.join(` | `)}`)
            .addField('**__Nền tảng đang sử dụng:__**', `${entries || 'Thành viên đang ngoại tuyến'}`);
        if (activities.length > 0) whoisembed.setDescription(`**__Hoạt động của thành viên:__** <@!${member.user.id}>\n${activities.join('\n')}`);
        if (customStatus) whoisembed.addFields({ name: '**__Custom Status:__**', value: `${customStatus}` });

        message.channel.send({ embeds: [whoisembed] });
    }
}