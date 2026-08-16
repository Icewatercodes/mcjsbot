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

    const statusType = 'Online';

    const statusMap = {
        'online': PresenceUpdateStatus.Online,
        'idle': PresenceUpdateStatus.Idle,
        'dnd': PresenceUpdateStatus.DoNotDisturb,
        'Offline': PresenceUpdateStatus.Invisible
    };

    client.user.setPresence({
        status: statusMap[statusType]
    });

    console.log(`bot status ${statusType}`);
    
});

client.on(Event.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandname);

    if(!command) {
        console.error(`no command matching ${interaction.commandName} was found `);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if(interaction.replied || interaction.deferred) {
            await interaction.followup({content: 'there was an error executing this command', ephemeral: true});
        } else {
            await interaction.reply({ content: 'there was an error', ephemeral: true})
        }
    }

    
});

client.login(process.env.TOKEN)