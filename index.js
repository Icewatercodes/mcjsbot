require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const deployCommands = async () => {
    try {
        const commands = [];

        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }else {
                console.log(`warning: command ${file} is missing data or execute `)
            }
        }
    
        const rest = new REST().setToken(process.env.TOKEN);

        console.log(`started rehrishngjgn ${commands.length} app / commands`);
        console.log(commands);
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: commands }
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

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filepath = path.join(commandsPath, file);
    const command = require(filepath);

    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`loaded ${command.data.name}`);
    } else {
        console.log(`command: ${filepath} is wrong`);
    }
}

console.log(`commands: ${client.commands.size}`);

client.once(Events.ClientReady, async () => {
    console.log(`ready! logged in as ${client.user.tag}`);

    //await deployCommands
    await deployCommands();
    console.log("deployed")

    const statusType = 'onl';

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

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()){
        console.log("is not chatinput command");
        return;
    }

    const command = client.commands.get(interaction.commandName);
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


client.login(process.env.TOKEN);
