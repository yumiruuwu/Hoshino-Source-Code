const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wiki = require('wikijs').default;
const wait = require('util').promisify(setTimeout);
const _ = require('lodash');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Wikipedia')
        .addSubcommand(subcommand =>
            subcommand.setName('searchpage')
                .setDescription('Tìm kiếm cụ thể bằng từ khoá')
                .addStringOption(option =>
                    option.setName('keyword')
                        .setDescription('Vui lòng nhập từ khoá')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('language')
                        .setDescription('Vui lòng chọn ngôn ngữ')
                        .setRequired(true)
                        .addChoice('Tiếng Anh', 'en')
                        .addChoice('Tiếng Việt', 'vi'))),
    async execute (client, interaction) {
        const enwikiapiurl = 'https://en.wikipedia.org/w/api.php';
        const viwikiapiurl = 'https://vi.wikipedia.org/w/api.php';
        await interaction.deferReply();
        await wait(4000);

        try {
            if (interaction.options.getSubcommand() === 'searchpage') {
                const keyword = interaction.options.getString('keyword');
                const lang = interaction.options.getString('language');

                const apiurl = [];

                if (lang === 'en') {
                    apiurl.push(enwikiapiurl);
                } else if (lang === 'vi') {
                    apiurl.push(viwikiapiurl);
                }

                wiki({
                    apiUrl: `${apiurl}`,
                    origin: null
                }).find(`${keyword}`).then( async(page) => {
                    const result = await Promise.all([
                        page.raw.title,
                        page.raw.fullurl,
                        page.mainImage(),
                        page.summary(),
                    ]);
                    //console.log(result[2]);
                    //console.log(finalmainimage);
                    let shortedSummary = result[3].split('\n')
                    shortedSummary = _.take(shortedSummary, 2)
                    shortedSummary = shortedSummary.toString().substring(0, 800) + '...'

                    const searchEmbed = new MessageEmbed()
                    .setTitle(result[0])
                    .setURL(result[1])
                    .setColor('LIGHT_GREY')
                    .setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/YDQ5sBS.png', url: 'https://www.wikipedia.org' })
                    .setThumbnail(result[2])
                    .setDescription(shortedSummary)

                    await interaction.editReply({ embeds: [searchEmbed] });
                }).catch(e => {
                    console.log(e);
                    return interaction.editReply({ content: 'Đã xảy ra lỗi! Có thể là do không tìm được kết quả dựa theo từ khoá hoặc kết quả chưa có ngôn ngữ mà bạn muốn xem.' });
                });
            }
        } catch (err) {
            console.log("Đã xảy ra lỗi => ", err);
        }
    }
}