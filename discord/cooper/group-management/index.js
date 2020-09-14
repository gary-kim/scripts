const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', main);

client.login(process.env.DISCORD_TOKEN);

function main() {
    console.log("Ready!");
}

client.on('message', m => {
    if (!m.content.startsWith("!")) {
        return;
    }
    // Everything after this requires the user to be a mod
    if (!m.author.roles.cache.some(role => role.name === "mods")) {
        console.log("cannot find non-mod command for message by non-mod user");
        return;
    }
    if (m.content.startsWith("!place_engineers")) {
        place_engineers(m);
        return;
    }
});

async function place_engineers(m) {
    m.react('👍');
    const engineer_groups = ['civile', 'meche', 'electricale', 'cheme', 'bse'];
    // Get all users
    const members = await m.guild.members.fetch();
    // Find engineers
    const engineers = members.filter(member => member.roles.cache.some(role => engineer_groups.includes(role.toLowerCase())));
    // Add to engineers group
    const engineers_group = m.guild.roles.cache.find(role => role.name.toLowerCase() === 'engineers');
    // Add engineers group to all engineers
    engineers.forEach(member => {
        member.roles.add(engineers_group);
    });
    m.channel.send("Engineer roles complete");
}
