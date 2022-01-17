//const { DisTube } = require("distube");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

const q0 = {
    '0': `<a:musicbeat:908204614057353276> Đang phát`,
    '1': "1",
    '2': "2",
    '3': "3",
    '4': "4",
    '5': "5",
    '6': "6",
    '7': "7",
    '8': "8",
    '9': "9",
    '10': "10",
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('BETA')
        .addSubcommand(subcommand =>
            subcommand.setName('play')
                .setDescription('Phát nhạc')
                .addStringOption(option =>
                    option.setName('input')
                        .setDescription('Nhập tên hoặc link video YouTube vào đây.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('search')
                .setDescription('Tìm nhạc để phát')
                .addStringOption(option =>
                    option.setName('input')
                        .setDescription('Vui lòng nhập từ khoá tìm kiếm')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('pause')
                .setDescription('Tạm dừng phát nhạc'))
        .addSubcommand(subcommand =>
            subcommand.setName('resume')
                .setDescription('Tiếp tục phát nhạc đang dừng'))
        .addSubcommand(subcommand =>
            subcommand.setName('volume')
                .setDescription('Chỉnh âm lượng')
                .addIntegerOption(option =>
                    option.setName('percentage')
                        .setDescription('1-100')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('queue')
                .setDescription('Xem hàng chờ'))
        .addSubcommand(subcommand =>
            subcommand.setName('skip')
                .setDescription('Bỏ qua bài đang phát'))
        .addSubcommand(subcommand =>
            subcommand.setName('jump')
                .setDescription('Nhảy đến bài muốn phát')
                .addIntegerOption(option =>
                    option.setName('number')
                        .setDescription('Con số tương ứng với số thứ tự của bài')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('loop')
                .setDescription('Bật/Tắt chế độ lặp lại')
                .addStringOption(option =>
                    option.setName('switch')
                        .setDescription('On = Bật, Off = Tắt, All = Tất cả các bài trong hàng chờ')
                        .setRequired(true)
                        .addChoice('On', 'on')
                        .addChoice('Off', 'off')
                        .addChoice('All', 'all')))
        .addSubcommand(subcommand =>
            subcommand.setName('stop')
                .setDescription('Dừng phát nhạc và thoát khỏi kênh voice')),
    async execute (client, interaction) {
        try {
            if (interaction.options.getSubcommand() === 'play') {
                await interaction.deferReply({ ephemeral: true });
                await wait(4000);
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.editReply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.editReply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });
                const input = interaction.options.getString('input');

                await interaction.client.distube.play(
                    voice_channel,
                    input,
                    {
                        textChannel: interaction.channel,
                        member: interaction.member,
                    }
                )

                await interaction.editReply({ content: 'Đang tìm kiếm...', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'search') {
                await interaction.deferReply();
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.editReply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.editReply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });
                const search_input = interaction.options.getString('input');

                await interaction.client.distube.search(search_input).then(async searchResult => {
                    if (searchResult == 0) return interaction.editReply({ content: 'Không có kết quả, hãy thử lại 1 từ khoá khác xem .-.', ephemeral: true });
                    const searchResultEmbed = new MessageEmbed()
                    // .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTitle(`Đã tìm thấy ${searchResult.length} kết quả!`)
                    .setDescription('Vui lòng chọn con số tương ứng với các con số của kết quả bên dưới.\n**Chú ý:** Bạn chỉ có __30 giây__ để thực hiện trước khi tiến trình này hết hạn.')
                    .setColor('RANDOM')
                    .setFooter({ text: `Interaction by ${interaction.user.tag}`})

                    await searchResult.map((s, i) => searchResultEmbed.addFields({ name: `${i + 1}. ${s.name}`, value: `Được đăng bởi: [${s.uploader.name}](${s.uploader.url}) | ${s.views} lượt xem | Thời lượng: ${s.formattedDuration}` }))

                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('choose_song')
                            .setPlaceholder('Vui lòng chọn 1 bài hát :3')
                            .addOptions([
                                {
                                    label: `${searchResult[0].name}`,
                                    description: `${searchResult[0].uploader.name}`,
                                    value: `${searchResult[0].url}`,
                                },
                                {
                                    label: `${searchResult[1].name}`,
                                    description: `${searchResult[1].uploader.name}`,
                                    value: `${searchResult[1].url}`,
                                },
                                {
                                    label: `${searchResult[2].name}`,
                                    description: `${searchResult[2].uploader.name}`,
                                    value: `${searchResult[2].url}`,
                                },
                                {
                                    label: `${searchResult[3].name}`,
                                    description: `${searchResult[3].uploader.name}`,
                                    value: `${searchResult[3].url}`,
                                },
                                {
                                    label: `${searchResult[4].name}`,
                                    description: `${searchResult[4].uploader.name}`,
                                    value: `${searchResult[4].url}`,
                                },
                                {
                                    label: `${searchResult[5].name}`,
                                    description: `${searchResult[5].uploader.name}`,
                                    value: `${searchResult[5].url}`,
                                },
                                {
                                    label: `${searchResult[6].name}`,
                                    description: `${searchResult[6].uploader.name}`,
                                    value: `${searchResult[6].url}`,
                                },
                                {
                                    label: `${searchResult[7].name}`,
                                    description: `${searchResult[7].uploader.name}`,
                                    value: `${searchResult[7].url}`,
                                },
                                {
                                    label: `${searchResult[8].name}`,
                                    description: `${searchResult[8].uploader.name}`,
                                    value: `${searchResult[8].url}`,
                                },
                                {
                                    label: `${searchResult[9].name}`,
                                    description: `${searchResult[9].uploader.name}`,
                                    value: `${searchResult[9].url}`,
                                },
                                // {
                                //     label: 'Huỷ tìm kiếm',
                                //     description: 'Sẽ hoạt động như tên của lựa chọn này :v',
                                //     value: 'cancel',
                                // },
                            ])
                    );

                    await interaction.editReply({ embeds: [searchResultEmbed], components: [row] }).then((msg) => {
                        setTimeout(function() {
                            msg.delete();
                        }, 30000);
                    });

                    const collector = interaction.channel.createMessageComponentCollector({
                        componentType: 'SELECT_MENU',
                        time: 15000
                    });

                    collector.on('collect', async (collected) => {
                        if (!collected.isSelectMenu()) return;
                        const value = collected.values[0];
                        //console.log(collected);
                        //await interaction.deferUpdate();
                        //await wait(4000);
                        if (collected.user.id !== interaction.user.id) {
                            collected.reply({ content: `Này ${collected.user}!! Tiến trình này không dành cho bạn .-.`, ephemeral: true })
                            return;
                        }
                        await client.distube.play(
                            voice_channel,
                            value,
                            {
                                textChannel: interaction.channel,
                                member: interaction.member,
                            }
                        );
                        return interaction.editReply({ content: 'Vui lòng chờ 1 lúc để thêm bài hát được yêu cầu vào hàng chờ <:EH_fusa_cs:807527951612248064>👍', embeds: [], components: [] });
                    })
                });
            } else if (interaction.options.getSubcommand() === 'pause') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                if(!queue.pause) {
                    interaction.reply({ content: 'Trình phát nhạc đang được tạm dừng!', ephemeral: true })
                    return;
                }

                try {
                    client.distube.pause(voice_channel)
                    interaction.reply({ content: 'Đã tạm dừng phát nhạc!'})
                    return;
                } catch (e) {
                    interaction.reply({ content: `Đã xảy ra lỗi: **${e}**`})
                }
            } else if (interaction.options.getSubcommand() === 'resume') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                try {
                    client.distube.resume(voice_channel)
                    interaction.reply({ content: 'Đã tiếp tục phát nhạc!'})
                    return;
                } catch (e) {
                    interaction.reply({ content: `Đã xảy ra lỗi: **${e}**`})
                }
            } else if (interaction.options.getSubcommand() === 'volume') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });
            
                let percentage = interaction.options.getInteger('percentage');
                if(percentage < '1') return interaction.reply({ content: 'Bạn có thể dùng pause để tạm dừng nhạc chứ không nhất thiết phải chỉnh âm lượng bé hơn 1 .-.', ephemeral: true });
                if(percentage > '100') return interaction.reply({ content: 'Xin lỗi nhưng yêu cầu chỉnh âm lượng của bạn mình sẽ không thực hiện vì con số mà bạn đưa ra quá lớn có thể sẽ gây ảnh hưởng tới màng nhĩ của bạn. Hãy thử lại với con số bé hơn 100 nhé :>', ephemeral: true });

                try {
                    client.distube.setVolume(voice_channel, percentage)
                    interaction.reply({ content: `Âm lượng đã được chỉnh thành **${percentage}%**`})
                } catch (e) {
                    interaction.channel.reply({ content: `Đã xảy ra lỗi: **${e}**` })
                }
            } else if (interaction.options.getSubcommand() === 'queue') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });
                const queue = client.distube.getQueue(interaction.member.voice.channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                const queueEmbed = new MessageEmbed()
                .setTitle(`Hàng chờ - ${interaction.guild.name}`)
                .setDescription('\n' + queue.songs.map((song, id) => `**${q0[id - 1 + 1]}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 11).join('\n\n'))
                .setThumbnail(interaction.guild.iconURL())
                .setColor('RANDOM')
                .setTimestamp()

                interaction.reply({ embeds: [queueEmbed] })
            } else if (interaction.options.getSubcommand() === 'skip') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                client.distube.skip(voice_channel)
                interaction.reply({ content: 'Đã bỏ qua bài đang phát!' })
            } else if (interaction.options.getSubcommand() === 'loop') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                const switcher = interaction.options.getString('switch');
            
                if (switcher === 'on') {
                    client.distube.setRepeatMode(voice_channel, 1)
                    interaction.reply({ content: 'Chế độ lặp lại đã bật!' })
                    return;
                } else if (switcher === 'off') {
                    client.distube.setRepeatMode(voice_channel, 0)
                    interaction.reply({ content: 'Chế độ lặp lại đã tắt!' })
                    return;
                } else if (switcher === 'all') {
                    client.distube.setRepeatMode(voice_channel, 2)
                    interaction.reply({ content: 'Chế độ lặp lại tất cả các bài trong hàng chờ đã bật!' })
                    return;
                }
            } else if (interaction.options.getSubcommand() === 'stop') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                client.distube.stop(voice_channel)
                interaction.reply({ content: 'Đã dừng phát nhạc và ngắt kết nối khỏi kênh voice. Cảm ơn bạn đã sử dụng dịch vụ của mình <3' })
            } else if (interaction.options.getSubcommand() === 'jump') {
                const voice_channel = interaction.member.voice.channel;
                if(!voice_channel) return interaction.reply({ content: 'Bạn cần tham gia kênh voice để tiến hành lệnh!', ephemeral: true });
                if(interaction.guild.me.voice.channel && voice_channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: 'Mình hiện đang phục vụ cho người khác, bạn phải chờ đến khi mình rảnh thì quay lại nhé :>', ephemeral: true });

                const queue = client.distube.getQueue(voice_channel)
                if(!queue) return interaction.reply({ content: 'Không có bài nào đang phát trong hàng chờ.', ephemeral: true });

                const number = interaction.options.getInteger('number');
                client.distube.jump(voice_channel, number)
                interaction.reply({ content: `Đã bỏ qua và nhảy đến bài số ${number} trong hàng chờ!` })
            }
        } catch (e) {
            interaction.reply({ content: 'Đã xảy ra sự cố khi tiến hành lệnh!' })
            console.log(e)
        }
    }
}