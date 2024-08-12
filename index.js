const { Client, GatewayIntentBits, Partials, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const config = require('./config/bot/config.js'); // Angepasster Pfad zur config.js
const mods = require('./config/mods/mods.json'); // Angepasster Pfad zur mods.json

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log('==============================');
    console.log(' Bot is online!');
    console.log('==============================');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log('Registering commands...');

    registerCommands();
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if (command.data && Array.isArray(command.data) && command.data.some(cmd => cmd.name === interaction.commandName)) {
                if (command.handleCommand) {
                    try {
                        await command.handleCommand(interaction);
                    } catch (error) {
                        console.error(`Error executing command ${interaction.commandName}:`, error);
                    }
                }
                break;
            }
        }
    }
});

client.login(config.token);

function registerCommands() {
    const rest = new REST({ version: '10', timeout: 10000 }).setToken(config.token);
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command.data && Array.isArray(command.data)) {
            commands.push(...command.data);
            console.log(`Registered command: ${command.data[0].name}`);
        } else {
            console.error(`No valid data found in command file: ${file}`);
        }
    }

    rest.put(Routes.applicationCommands(config.clientId), { body: commands })
        .then(() => {
            console.log('==============================');
            console.log(' All commands registered successfully!');
            console.log('==============================');
            console.log('The bot is now ready to accept commands!');
        })
        .catch(console.error);
}
