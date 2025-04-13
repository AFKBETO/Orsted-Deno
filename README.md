# Orsted-Bot-Deno
A Discord bot project using Deno

## Prerequisites
1. Deno 2.2.9 or higher
- Install Deno: https://deno.land/#installation
2. MongoDB database
3. A Discord bot
- Create a bot: https://discord.com/developers/applications
4. A Discord server
- Make sure to invite the bot into the server with appropriate permissions. Some permissions can be dangerous (*), so add them at your own risks.
    - View Channels
    - Manage Channels (*)
    - Time out members (*)
    - Manage Server (to view invites) (*)
    - Send Messages
    - Send Messages in Threads
    - Create Public Threads
    - Embed Links
    - Attach Files
    - Add Reactions
    - Use External Emojis
    - Use External Stickers
    - Manage Messages (*)

## Running the bot locally
1. Clone the repository
```bash
git clone --recurse-submodules https://github.com/AFKBETO/Orsted-Deno.git
cd Orsted-Deno
```
In case there are some private submodules, you can exclude them by using the following command:
```bash
git clone https://github.com/AFKBETO/Orsted-Deno.git
cd Orsted-Deno
git submodule init
git submodule update
```

This will run only the two main submodules that are public.

2. Install dependencies
```bash
deno install
```

3. Create a `.env` file in the root directory and add your bot token and MongoDB connection string
```env
ORSTED_MONGO_URI=your-mongodb-connection-string
ORSTED_BOT_TOKEN=your-bot-token
ORSTED_GUILD_ID=your-guild-id
```

4. Run the bot
```bash
deno run dev
```
