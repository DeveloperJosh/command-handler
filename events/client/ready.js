const ms = require('ms')
module.exports = client => {

    client.user.setActivity(`test`, { type: 'WATCHING' });
    console.log(
        `Hello, I am online on ${client.guilds.cache.size} servers and serving ${
			client.users.cache.size
		} users`
    );
}