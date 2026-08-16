require('dotenv').config();
const { REST, Routes } = require('discord.js');

const deployCommands = async () => {
    try {
        const command = [];

        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if('data' in command && 'execute' in command) {
                command.push(command.data.toJSON());
            }else {
                console.log(`warning: command ${file} is missing data or execute `)
            }
        }
    
        const rest = new REST().setToken(process.env.TOKEN);

        console.log(`started rehrishngjgn ${command.length} app / comands`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: commandFiles}
        );

        console.log('Greate success with commands')

    } catch (error) {
        console.error(`deploy eroor ${error}`);
    }
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

    const statusType = process.env.BOT_STATUS || 'onl';
    console.log(statusType)

    const statusMap = {
        'onl': PresenceUpdateStatus.Online,
        'idl': PresenceUpdateStatus.Idle,
        'dnd': PresenceUpdateStatus.DoNotDisturb,
        'inv': PresenceUpdateStatus.Invisible,
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

try {
    client.login(process.env.TOKEN);
} catch (keybo) {
    
}