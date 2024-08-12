
```markdown
# Discord Bot

A simple Discord bot that offers various functionalities like creating product embeds and managing products.

## Prerequisites

Before you can use the bot, make sure you have the following prerequisites:

- Node.js (v14 or higher)
- A Discord bot token ([create one here](https://discord.com/developers/applications))
- A Discord server where you want to use the bot

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   Ensure you're in the project's root directory and run the following command:

   ```bash
   npm install
   ```

## Configuration

### Option 1: Using `config.js` (default)

1. **Bot Configuration:**

   Edit the `config.js` file located in the `config/bot/` directory and insert your bot token and client ID:

   ```javascript
   module.exports = {
       token: 'your-bot-token-here',
       clientId: 'your-client-id-here',
   };
   ```

2. **Mod Configuration:**

   In the `mods.json` file located in the `config/mods/` directory, you can configure the role ID for team members:

   ```json
   {
       "teamRoleId": "roleid"
   }
   ```

### Using `.env` for Configuration

We will replace the `config.js` file entirely by using environment variables with a `.env` file.

1. **Delete the `config.js` file:**

   If you have a `config.js` file, you can delete it as it will no longer be needed:

   ```bash
   rm ./config/bot/config.js
   ```

2. **Create a `.env` file in the root directory:**

   In the root directory of your project, create a `.env` file and add your configuration variables:

   ```plaintext
   TOKEN=your-bot-token-here
   CLIENT_ID=your-client-id-here
   TEAM_ROLE_ID=roleid
   ```

3. **Install the `dotenv` package:**

   You'll need to install the `dotenv` package to load environment variables from the `.env` file:

   ```bash
   npm install dotenv
   ```

4. **Modify the code to use environment variables:**

   Update your `index.js` and other necessary files to use the environment variables. Here's how you can do it in `index.js`:

   ```javascript
   require('dotenv').config();
   const { Client, GatewayIntentBits, Partials, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
   const fs = require('fs');
   const path = require('path');

   // Using environment variables
   const token = process.env.TOKEN;
   const clientId = process.env.CLIENT_ID;
   const mods = {
       teamRoleId: process.env.TEAM_ROLE_ID
   };
   ```

## Starting the Bot

1. **Start the Bot:**

   In the root directory, run the following command:

   ```bash
   node index.js
   ```

   If everything is correctly configured, the bot should start, and you'll see a message in the console indicating that it is online.

2. **Register Commands:**

   The bot automatically registers all commands upon startup. Ensure that the corresponding slash commands are available on your Discord server.

## Usage

### Commands

The bot offers various commands that can be used via slash commands on Discord:

- `/cp`: Create a product embed using a form.
- `/mp`: Send an embed with buttons for product management.

### Product Management Example

- **Add Product**: Use the appropriate button in the management embed to add a product.
- **Remove Product**: Select the product to remove and confirm.
- **Edit Product**: Edit the name or price of a product using the management embed.

## Troubleshooting

If issues arise:

1. Verify that the bot token and client ID are correctly entered in the `.env` file.
2. Ensure the bot has the correct permissions on the Discord server.
3. Check the console for error messages and address them accordingly.

## Contributing

Contributions to this project are welcome. Please create a pull request or open an issue if you have suggestions or encounter problems.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
```
