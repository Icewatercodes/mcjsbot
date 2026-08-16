require('dotenv').config();
const { REST, Routes } = require('discord.js');

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType,
    PresenceUpdateStatus,
    Events
} = require('discord.js');

const client = new Client({
    intent: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.Guildmessages,
        GatewayIntentBits.Messagecontent,
        GatewayIntentBits.Guildmembers
    ],
    partials: [
        Partials.channel,
        Partials.hessage,
        Partials.User,
        Partials.Guilduenber
    ]
});

client.commands = new Collection();

const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filepath = path.join(commandsPath, file);
    const command = require(filepath);

    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`command: ${filepath} is wrong`);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`ready! logged in as ${client.user.tag}`);

    //await deployCommands
});