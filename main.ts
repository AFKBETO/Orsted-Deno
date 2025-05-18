import '@orsted/utils';
import { Client, Events } from 'discord.js';
import { config } from './config/config.ts';
import { intents } from './config/intentOptions.ts';
import { partials } from './config/partialOptions.ts';
import { onReady } from './src/events/onReady.ts';
import { errorHandler } from './src/utils/errorHandler.ts';
import { onInteraction } from './src/events/onInteraction.ts';
import { onReactionAdd } from './src/events/onReactionAdd.ts';
import { onInviteCreate } from './src/events/onInviteCreate.ts';
import { onGuildMemberAdd } from './src/events/onGuildMemberAdd.ts';
import { onMessageCreate } from './src/events/onMessageCreate.ts';
import { connectDatabase, getConfigData, Utils } from '@orsted/utils';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    self.addEventListener('error', (event) => {
        errorHandler(event.error);
        event.preventDefault();
    });

    self.addEventListener('unhandledrejection', (event) => {
        errorHandler(event.reason);
        event.preventDefault();
    });
    await connectDatabase();
    console.log('Fetching config data...');
    const botConfig = await getConfigData();
    if (!botConfig) {
        throw new Error('No config data found');
    }
    console.log('Config data fetched successfully.');

    const client = new Client({ intents: intents, partials: partials });
    client.on('error', errorHandler);
    client.on('warn', (message) => console.error('warn', message));
    client.botConfig = botConfig;
    await Utils.initializeClientUtils(client);
    if (config.environment !== 'production') {
        client.on('debug', (message) => console.error('debug', message));
    }
    client.once(Events.ClientReady, onReady);
    client.on(Events.InteractionCreate, onInteraction);
    client.on(Events.MessageReactionAdd, onReactionAdd);
    client.on(Events.MessageCreate, onMessageCreate);
    client.on(Events.InviteCreate, onInviteCreate);
    client.on(
        Events.GuildMemberAdd,
        async (member) => await onGuildMemberAdd(client, member),
    );
    client.login(config.bot_token);
}
