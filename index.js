const Discord = require('discord.js');
const { Collection, Client, MessageEmbed, Intents } = require('discord.js');
require('dotenv').config();
const { MessageAttachment } = require('discord.js');
const date = new Date();
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
const client = new Discord.Client({
    disableEveryone: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

let token = process.env.TOKEN;
let prefix = process.env.PREFIX;

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
const Timeout = new Set();
["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('message', async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    if (!message.member)
        message.member = await message.guild.fetchMember(message);
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const com = args.shift().toLowerCase();
    if (com.length == 0) return;
    const command =
        client.commands.get(com) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(com));
    if (command) {
        if (command.timeout) {
            if (Timeout.has(`${message.author.id}${command.name}`)) {
                let um = new Discord.MessageEmbed();
                um.setTitle('Hold Up ✋!');
                um.setDescription(
                    `You have to wait more ${ms(
                          command.timeout
                      )}, to use this command again`
                );
                um.addField(
                    'Why?',
                    'Because this system was installed, in order not to flood the chat with bot commands everywhere',
                    true
                );
                um.setFooter(`This message gets deleted after 10s`);
                um.setTimestamp(new Date());
                um.setColor(0xf94343);
                return message
                    .reply(um)
                    .then(message => message.delete({ timeout: 10000 }));
            } else {
                Timeout.add(`${message.author.id}${command.name}`);
                setTimeout(() => {
                    Timeout.delete(`${message.author.id}${command.name}`);
                }, command.timeout);
            }
        }
        command.run(client, message, args);
    }
});

client.login(token);