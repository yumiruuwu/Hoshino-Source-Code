const { glob } = require("glob");
const { promisify } = require("util");

const globPromise = promisify(glob);

module.exports = async (client) => {
    const prefixcommandFiles = await globPromise(`${process.cwd()}/prefixcommands/**/*.js`);
    prefixcommandFiles.map((value) => {
        const prefixcommand_file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (prefixcommand_file.name) {
            const properties = { directory, ...prefixcommand_file };
            client.prefixcommands.set(prefixcommand_file.name, properties);
        }
    });
};