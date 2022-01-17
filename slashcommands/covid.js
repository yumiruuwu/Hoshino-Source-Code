const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const covidapi = require('novelcovid');
const moment = require('moment-timezone');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Thống kê các ca nhiễm khắp toàn cầu và quốc gia')
        .addStringOption(option =>
            option.setName('country')
                .setDescription('Tên quốc gia. VD: vietnam, usa,etc. Để trống nếu muốn xem thống kê toàn cầu')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('history')
                .setDescription('Lịch sử ghi nhận. Để trống nếu muốn xem thống kê hôm nay')
                .setRequired(false)
                .addChoice('Hôm qua', 'yesterday')
                .addChoice('2 ngày trước', 'twodaysago')),
        async execute (client, interaction) {
            const country = interaction.options.getString('country');
            const history = interaction.options.getString('history');

            await interaction.deferReply();
            await wait(4000);

            covidapi.settings({ baseUrl: 'https://disease.sh' });

            //covidapi.all().then(console.log);
            //covidapi.yesterday.all().then(console.log);
            // covidapi.twoDaysAgo.all().then(console.log); deprecated?
            const globalstt = await covidapi.all();
            const yesglobalstt = await covidapi.yesterday.all();

            const countrystt = await covidapi.countries({ country: `${country}` });
            const yescountrystt = await covidapi.yesterday.countries({ country: `${country}` });
            // console.log(countrystt);
            // console.log(yescountrystt);
            //const twodaysglobal = await covidapi.twoDaysAgo.all(); deprecated?
            if (!country) {  
                if (!history) {
                    const globalEmbed = new MessageEmbed()
                    .setTitle('Thống kê tình hình dịch bệnh toàn cầu')
                    .setColor('LUMINOUS_VIVID_PINK')
                    .setDescription(`- Dưới đây là thống kê số ca bị nhiễm - đã khỏi - tử vong trong ngày hôm nay.`)
                    .addFields(
                        {name: 'Tổng số ca bị nhiễm:', value: `${globalstt.cases} ca`, inline: true},
                        {name: 'Tổng số ca đã khỏi:', value: `${globalstt.recovered} ca`, inline: true},
                        {name: 'Tổng số ca tử vong:', value: `${globalstt.deaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Số ca bị nhiễm hôm nay:', value: `${globalstt.todayCases} ca`, inline: true},
                        {name: 'Số ca đã khỏi hôm nay:', value: `${globalstt.todayRecovered} ca`, inline: true},
                        {name: 'Số ca tử vong hôm nay:', value: `${globalstt.todayDeaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Tỉ lệ nhiễm:', value: `${(globalstt.casesPerOneMillion / 10000).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ hồi phục:', value: `${(globalstt.recovered / globalstt.cases * 100).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ tử vong:', value: `${(globalstt.deaths / globalstt.cases * 100).toFixed(4)} %`, inline: true}
                    )
                    .addFields(
                        {name: 'Dân số thế giới:', value: `${globalstt.population}`, inline: true},
                        {name: 'Đã test:', value: `${globalstt.tests}`, inline: true},
                        {name: 'Tỉ lệ test:', value: `${(globalstt.testsPerOneMillion / 10000).toFixed(4)} %`, inline: true}
                    )
                    .setFooter({ text: `Cập nhật lúc ${moment(globalstt.updated).format('HH:mm:ss, [ngày] D [tháng] M [năm] YYYY')}`})
                    
                    await interaction.editReply({ embeds: [globalEmbed] });
                } else if (history === 'yesterday') {
                    const yesterdayGlobalEmbed = new MessageEmbed()
                    .setTitle('Thống kê tình hình dịch bệnh toàn cầu')
                    .setColor('LUMINOUS_VIVID_PINK')
                    .setDescription(`- Dưới đây là thống kê số ca bị nhiễm - đã khỏi - tử vong trong ngày hôm qua.`)
                    .addFields(
                        {name: 'Tổng số ca bị nhiễm:', value: `${yesglobalstt.cases} ca`, inline: true},
                        {name: 'Tổng số ca đã khỏi:', value: `${yesglobalstt.recovered} ca`, inline: true},
                        {name: 'Tổng số ca tử vong:', value: `${yesglobalstt.deaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Số ca bị nhiễm hôm qua:', value: `${yesglobalstt.todayCases} ca`, inline: true},
                        {name: 'Số ca đã khỏi hôm qua:', value: `${yesglobalstt.todayRecovered} ca`, inline: true},
                        {name: 'Số ca tử vong hôm qua:', value: `${yesglobalstt.todayDeaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Tỉ lệ nhiễm:', value: `${(yesglobalstt.casesPerOneMillion / 10000).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ hồi phục:', value: `${(yesglobalstt.recovered / yesglobalstt.cases * 100).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ tử vong:', value: `${(yesglobalstt.deaths / yesglobalstt.cases * 100).toFixed(4)} %`, inline: true}
                    )
                    .addFields(
                        {name: 'Dân số thế giới:', value: `${yesglobalstt.population}`, inline: true},
                        {name: 'Đã test:', value: `${yesglobalstt.tests}`, inline: true},
                        {name: 'Tỉ lệ test:', value: `${(yesglobalstt.testsPerOneMillion / 10000).toFixed(4)} %`, inline: true}
                    )
                    
                    await interaction.editReply({ embeds: [yesterdayGlobalEmbed] });
                } else if (history === 'twodaysago') {
                    await interaction.reply({ content: '*deprecated*', ephemeral: true })
                }
            } else if (country) {
                if (countrystt.message || yescountrystt.message) return interaction.editReply({ content: 'Không tìm thấy quốc gia mà bạn yêu cầu.' });
                //return interaction.reply({ content: 'Coming Soon...', ephemeral: true });
                if (!history) {
                    const countryEmbed = new MessageEmbed()
                    .setTitle(`Thống kê tình hình dịch bệnh ở ${countrystt.country}`)
                    .setDescription(`- Dưới đây là thống kê số ca bị nhiễm - đã khỏi - tử vong trong ngày hôm nay.\n**1 số quốc gia sẽ mất nhiều thời gian để cập nhật dữ liệu nên sẽ có khả năng chưa có thống kê cho hôm nay**`)
                    .setThumbnail(`${countrystt.countryInfo.flag}`)
                    .addFields(
                        {name: 'Tổng số ca bị nhiễm:', value: `${countrystt.cases} ca`, inline: true},
                        {name: 'Tổng số ca đã khỏi:', value: `${countrystt.recovered} ca`, inline: true},
                        {name: 'Tổng số ca tử vong:', value: `${countrystt.deaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Số ca bị nhiễm hôm nay:', value: `${countrystt.todayCases} ca`, inline: true},
                        {name: 'Số ca đã khỏi hôm nay:', value: `${countrystt.todayRecovered} ca`, inline: true},
                        {name: 'Số ca tử vong hôm nay:', value: `${countrystt.todayDeaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Tỉ lệ nhiễm:', value: `${(countrystt.casesPerOneMillion / 10000).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ hồi phục:', value: `${(countrystt.recovered / countrystt.cases * 100).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ tử vong:', value: `${(countrystt.deaths / countrystt.cases * 100).toFixed(4)} %`, inline: true}
                    )
                    .addFields(
                        {name: 'Tổng dân số:', value: `${countrystt.population}`, inline: true},
                        {name: 'Đã test:', value: `${countrystt.tests}`, inline: true},
                        {name: 'Tỉ lệ test:', value: `${(countrystt.testsPerOneMillion / 10000).toFixed(4)} %`, inline: true}
                    )
                    .setFooter({ text: `Cập nhật lúc ${moment(countrystt.updated).format('HH:mm:ss, [ngày] D [tháng] M [năm] YYYY')}`})

                    await interaction.editReply({ embeds: [countryEmbed] });
                } else if (history === 'yesterday') {
                    const yesterdayCountryEmbed = new MessageEmbed()
                    .setTitle(`Thống kê tình hình dịch bệnh ở ${yescountrystt.country}`)
                    .setDescription(`- Dưới đây là thống kê số ca bị nhiễm - đã khỏi - tử vong trong ngày hôm qua.`)
                    .setThumbnail(`${yescountrystt.countryInfo.flag}`)
                    .addFields(
                        {name: 'Tổng số ca bị nhiễm:', value: `${yescountrystt.cases} ca`, inline: true},
                        {name: 'Tổng số ca đã khỏi:', value: `${yescountrystt.recovered} ca`, inline: true},
                        {name: 'Tổng số ca tử vong:', value: `${yescountrystt.deaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Số ca bị nhiễm hôm qua:', value: `${yescountrystt.todayCases} ca`, inline: true},
                        {name: 'Số ca đã khỏi hôm qua:', value: `${yescountrystt.todayRecovered} ca`, inline: true},
                        {name: 'Số ca tử vong hôm qua:', value: `${yescountrystt.todayDeaths} ca`, inline: true}
                    )
                    .addFields(
                        {name: 'Tỉ lệ nhiễm:', value: `${(yescountrystt.casesPerOneMillion / 10000).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ hồi phục:', value: `${(yescountrystt.recovered / yescountrystt.cases * 100).toFixed(4)} %`, inline: true},
                        {name: 'Tỉ lệ tử vong:', value: `${(yescountrystt.deaths / yescountrystt.cases * 100).toFixed(4)} %`, inline: true}
                    )
                    .addFields(
                        {name: 'Tổng dân số:', value: `${yescountrystt.population}`, inline: true},
                        {name: 'Đã test:', value: `${yescountrystt.tests}`, inline: true},
                        {name: 'Tỉ lệ test:', value: `${(yescountrystt.testsPerOneMillion / 10000).toFixed(4)} %`, inline: true}
                    )

                    await interaction.editReply({ embeds: [yesterdayCountryEmbed] });
                } else if (history === 'twodaysago') {
                    await interaction.reply({ content: '*deprecated*', ephemeral: true })
                }
            }
        }
}