const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'test',
    category: 'guild',
    description: '',
    aliases: [''],
    usage: '',
    run: async(client, message, args) => {
        try {
            message.channel.send('worked')
        } catch (err) {
            console.log(err)
            return message.channel.send(`Error: ${err.message}`)
        }
    }
}