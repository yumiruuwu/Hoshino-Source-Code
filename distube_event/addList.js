const Discord = require('discord.js');

module.exports = (client, queue, playlist ) => {
    const addListEmbed = new Discord.MessageEmbed()
    .setTitle(`${playlist.name}`)
    .setURL(`${playlist.url}`)
    .setColor('RANDOM')
    //.setAuthor('Đã thêm danh sách phát vào hàng chờ!', 'https://media1.giphy.com/media/FSjyC9RbjJNq7mN7VG/giphy.gif')
    .setAuthor({ name: 'Đã thêm danh sách phát vào hàng chờ!', iconURL: 'https://media1.giphy.com/media/FSjyC9RbjJNq7mN7VG/giphy.gif' })
    .setThumbnail(`${playlist.thumbnail}`)
    .addFields(
        { name: '**__Danh sách phát gồm có:__**', value: `${playlist.songs.length} bài`, inline: true },
        { name: '**__Tổng thời gian để phát hết:__**', value: `${playlist.formattedDuration}`, inline: true },
    )
    .addField('**__Được yêu cầu bởi:__**', `${playlist.user}`)
    //.setFooter(`ID của người yêu cầu: ${playlist.user.id}`)
    .setFooter({ text: `ID của người yêu cầu: ${playlist.user.id}` })
    .setTimestamp()

    queue.textChannel.send({ embeds: [addListEmbed] })

}