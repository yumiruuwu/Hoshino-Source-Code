const Discord = require('discord.js');

module.exports = (client, queue, song) => {
    const playEmbed = new Discord.MessageEmbed()
    .setTitle(`${song.name}`)
    .setURL(`${song.url}`)
    .setColor('RANDOM')
    //.setAuthor('Đang phát...', 'https://media1.giphy.com/media/FSjyC9RbjJNq7mN7VG/giphy.gif')
    .setAuthor({ name: 'Đang phát...', iconURL: 'https://media1.giphy.com/media/FSjyC9RbjJNq7mN7VG/giphy.gif' })
    .setThumbnail(`${song.thumbnail}`)
    .addFields(
        { name: '**__Được đăng bởi:__**', value: `${song.uploader.name}`, inline: true },
        { name: '**__Thời lượng:__**', value: `${song.formattedDuration}`, inline: true },
        { name: '**__Lượt xem/nghe:__**', value: `${song.views}`, inline: true},
    )
    .addFields(
        { name: '**__Lượt tương tác (YouTube):__**', value: `${song.likes} 👍 | ${song.dislikes} 👎`, inline: true },
        { name: '**__Lượt chia sẻ (SoundCloud):__**', value: `${song.reposts}`, inline: true },
        { name: '**__Được yêu cầu bởi:__**', value: `${song.user}`, inline: true },
    )
    //.setFooter(`ID của người yêu cầu: ${song.user.id}`)
    .setFooter({ text: `ID của người yêu cầu: ${song.user.id}` })
    .setTimestamp()

    queue.textChannel.send({ embeds: [playEmbed] })

}