import '@orsted/utils';
import { Client, Events } from 'discord.js';
import { config } from './config/config.ts';
import { intents } from './config/intentOptions.ts';
import { partials } from './config/partialOptions.ts';
import { onReady } from './src/events/onReady.ts';
import { errorHandler } from './src/utils/errorHandler.ts';
import { onInteraction } from './src/events/onInteraction.ts';
import { connectDatabase } from '@orsted/utils';
import { onReactionAdd } from './src/events/onReactionAdd.ts';
import { onInviteCreate } from './src/events/onInviteCreate.ts';
import { onGuildMemberAdd } from './src/events/onGuildMemberAdd.ts';
import { onMessageCreate } from './src/events/onMessageCreate.ts';
import { getConfigData } from '@orsted/utils';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    await connectDatabase();
    console.log('Fetching config data...');
    const botConfig = await getConfigData();
    if (!botConfig) {
        throw new Error('No config data found');
    }

    const client = new Client({ intents: intents, partials: partials });
    client.botConfig = botConfig;
    console.log('Config data fetched successfully.');

    client.on('error', errorHandler);
    client.once(Events.ClientReady, onReady);
    client.on(Events.InteractionCreate, onInteraction);
    client.on(Events.MessageReactionAdd, onReactionAdd);
    client.on(Events.MessageCreate, onMessageCreate);
    client.on(Events.InviteCreate, onInviteCreate);
    client.on(
        Events.GuildMemberAdd,
        async (member) => await onGuildMemberAdd(client, member),
    );
    client
        .on('debug', console.error)
        .on('warn', console.error);

    client.login(config.bot_token);
}
