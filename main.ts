import '@orsted/utils';
import { Client, Events } from 'discord.js';
import { config } from './config/config.ts';
import { intents } from './config/intentOptions.ts';
import { partials } from './config/partialOptions.ts';
import { onReady } from './src/events/onReady.ts';
import { errorHandler } from './src/utils/errorHandler.ts';
import { onInteraction } from './src/events/onInteraction.ts';
import { connectDatabase } from '@orsted/commands';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    const client = new Client({ intents: intents, partials: partials });

    await connectDatabase();

    client.on('error', errorHandler);
    client.once(Events.ClientReady, onReady);
    client.on(Events.InteractionCreate, onInteraction);
    client
        .on('debug', console.error)
        .on('warn', console.error);

    client.login(config.bot_token);
}
