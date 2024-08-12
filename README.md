
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

### Option 2: Using `.env` for Configuration

If you prefer to use environment variables instead of hardcoding sensitive information in `config.js`, follow these steps:

1. **Create a `.env` file in the root directory:**

   ```plaintext
   TOKEN=your-bot-token-here
   CLIENT_ID=your-client-id-here
   TEAM_ROLE_ID=roleid
   ```

2. **Install the `dotenv` package:**

   You'll need to install the `dotenv` package to load environment variables from the `.env` file:

   ```bash
   npm install dotenv
   ```

3. **Modify the `config.js` file to use environment variables:**

   Replace the content of `config.js` with:

   ```javascript
   require('dotenv').config();

   module.exports = {
       token: process.env.TOKEN,
       clientId: process.env.CLIENT_ID,
   };
   ```

4. **Update the `mods.json` to also use environment variables (optional):**

   If you want to use environment variables in `mods.json`, you need to modify how you load this configuration:

   ```javascript
   // config/mods/mods.json (Replace content)
   {
       "teamRoleId": process.env.TEAM_ROLE_ID
   }
   ```

5. **Update the `index.js` to load mods configuration from environment variables:**

   In `index.js`, update how the `mods` configuration is loaded:

   ```javascript
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

1. Verify that the bot token and client ID are correctly entered in the `config.js` file or `.env` file.
2. Ensure the bot has the correct permissions on the Discord server.
3. Check the console for error messages and address them accordingly.

## Contributing

Contributions to this project are welcome. Please create a pull request or open an issue if you have suggestions or encounter problems.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
```
