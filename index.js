require('dotenv').config();
const { REST, Routes } = require('discord.js');

const deployCommands = async () => {

}

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
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
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
    await deployCommands();
    console.log("deployed")
});